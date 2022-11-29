import React, { useEffect} from "react";
import { useNavigate, useParams  } from "react-router-dom";
import moment from 'moment';
import {
  DatePicker,
  Form,
  Input,
  Button,
  Radio,
  Select,
  ConfigProvider
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { editUser, getUserById } from "../../../Apis/UserApis";
dayjs.extend(customParseFormat);

export function EditUserPage() {
  const navigate = useNavigate();

  const { userId } = useParams();
  const [form] = Form.useForm();

  useEffect(() =>{
    getUserById(userId).then(res => {
      form.setFieldValue("firstName", res.firstName);
      form.setFieldValue("lastName", res.lastName);
      form.setFieldValue("gender", res.gender.toLowerCase());
      form.setFieldValue("dateOfBirth", moment(res.dateOfBirth, "DD/MM/YYYY"));
      form.setFieldValue("type", res.role);
      form.setFieldValue("joinedDate", moment(res.joinedDate, "DD/MM/YYYY"));
    })
    
  }, []);

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 7 }
  };

  const tailLayout = {
    wrapperCol: { offset: 9 }
  };

  const handleCancel = () => {
    navigate("/admin/manage-user");
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = async (values) => {
    await editUser(values)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Form {...layout}  onFinish={onFinish} form={form}>
        <h1 className="font-bold text-red-600 text-2xl">Edit User</h1>
        <Form.Item label="First Name" name="firstName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="dateOfBirth"
          label="Date Of Birth"
          rules={[
            { required: true, message: "Please enter your date of birth" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("dateOfBirth") <
                    dayjs().endOf("day").subtract(18, "year")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("User is under 18. Please select a different date")
                );
              }
            })
          ]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          class="text-red-600"
          rules={[{ required: true, message: "Please pick your gender!" }]}
        >
          <Radio.Group>
            <ConfigProvider
              theme={{
                components: {
                  Radio: {
                    colorPrimary: "#cf1322"
                  }
                }
              }}
            >
              <Radio value="female"> Female </Radio>
              <Radio value="male"> Male </Radio>
            </ConfigProvider>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="joinedDate"
          label="Joined Date"
          rules={[
            { required: true, message: "Please enter your joined date" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("joinedDate") > getFieldValue("dateOfBirth")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Joined date is not later than Date of Birth. Please select a different date"
                  )
                );
              }
            }),
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  (getFieldValue("joinedDate").day() !== 0 &&
                    getFieldValue("joinedDate").day() !== 6)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Joined date is Saturday or Sunday. Please select a different date"
                  )
                );
              }
            })
          ]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please pick an user type!" }]}
        >
          <Select>
            <Select.Option value="staff">Staff</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className="mx-2" type="primary" danger onClick={onFinish}>
            Save
          </Button>
          <Button className="mx-5" onClick={handleCancel} danger>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
