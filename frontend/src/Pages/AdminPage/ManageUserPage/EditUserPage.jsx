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
      form.setFieldValue("gender", res.gender === "Male" ? "0" : "1");
      form.setFieldValue("dateOfBirth", moment(res.dateOfBirth, "DD/MM/YYYY"));
      form.setFieldValue("role", res.role === "Admin" ? "0" : "1");
      form.setFieldValue("joinedDate", moment(res.joinedDate, "DD/MM/YYYY"));
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    console.log(values)
    values ={
      ...values,
      role: parseInt(values.role),
      gender: parseInt(values.gender),
      id: userId
    }

    await editUser(values)

    navigate("/admin/manage-user");
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
          className="text-red-600"
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
              <Radio value="1"> Female </Radio>
              <Radio value="0"> Male </Radio>
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
          name="role"
          rules={[{ required: true, message: "Please pick an user type!" }]}
        >
          <Select>
            <Select.Option value="1">Staff</Select.Option>
            <Select.Option value="0">Admin</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button className="mx-2" type="primary" danger htmlType="submit">
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
