import React, { useEffect , useState} from "react";
import { useNavigate, useParams  } from "react-router-dom";
import moment from 'moment';
import {
  DatePicker,
  Form,
  Input,
  Button,
  Radio,
  Select,
  ConfigProvider,
  Modal
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { editUser, getUserById } from "../../../Apis/UserApis";
import { DOB_REQUIRED, DOB_UNDER_18, GENDER_REQUIRED, JOINED_DATE_NOT_LATER_DOB, JOINED_DATE_NOT_WEEKENDS, JOINED_DATE_REQUIRED, ROLE_REQUIRED } from "../../../Constants/ErrorMessages";
import {
  GENDER_FEMALE_ENUM,
  GENDER_MALE_ENUM,
  ROLE_ADMIN_ENUM,
  ROLE_STAFF_ENUM
} from "../../../Constants/CreateUserConstants";
dayjs.extend(customParseFormat);

export function EditUserPage() {
  const navigate = useNavigate();

  const { userId } = useParams();

  const [form] = Form.useForm();

  const dateFormat = "YYYY/MM/DD"

  const [isModalOpen, setIsModalOpen] = useState(false);

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

    await editUser(values).then((data) => {
      console.log(data);
      setIsModalOpen(true);
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
            { required: true, message: DOB_REQUIRED },
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
                  new Error(DOB_UNDER_18)
                );
              }
            })
          ]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} format={dateFormat}/>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          className="text-red-600"
          rules={[{ required: true, message: GENDER_REQUIRED}]}
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
              <Radio value = {GENDER_FEMALE_ENUM}> Female </Radio>
              <Radio value = {GENDER_MALE_ENUM}> Male </Radio>
            </ConfigProvider>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="joinedDate"
          label="Joined Date"
          rules={[
            { required: true, message: JOINED_DATE_REQUIRED },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("joinedDate") > getFieldValue("dateOfBirth")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error( JOINED_DATE_NOT_LATER_DOB));
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
                return Promise.reject(new Error(JOINED_DATE_NOT_WEEKENDS));
              }
            })
          ]}
        >
          <DatePicker style={{ width: "100%" }} disabledDate={disabledDate} format={dateFormat}/>
        </Form.Item>
        <Form.Item
          label="Type"
          name="role"
          rules={[{ required: true, message: ROLE_REQUIRED }]}
        >
          <Select>
            <Select.Option value={ROLE_ADMIN_ENUM}>Admin</Select.Option>
            <Select.Option value={ROLE_STAFF_ENUM}>Staff</Select.Option>
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

      <Modal
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        closable={handleCancel}
        footer={[]}
      >
        <h1 className="text-2xl text-red-600 font-bold mb-5">
          Create User Success
        </h1>
        <p className="mb-8">User has been edited successfully!</p>
        <Button
          className="content-end"
          danger
          key="back"
          onClick={handleCancel}
        >
          Close
        </Button>
      </Modal>
    </>
  );
}
