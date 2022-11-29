import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  ConfigProvider,
  Modal
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { createUser } from "../../../Apis/CreateUserApis";
import {
  DOB_REQUIRED,
  DOB_UNDER_18,
  FIRST_NAME_REQUIRED,
  GENDER_REQUIRED,
  JOINED_DATE_NOT_LATER_DOB,
  JOINED_DATE_NOT_WEEKENDS,
  JOINED_DATE_REQUIRED,
  LAST_NAME_REQUIRED,
  NAME_ONLY_ALLOW,
  ROLE_REQUIRED
} from "../../../Constants/ErrorMessages";
dayjs.extend(customParseFormat);

export function CreateUserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  const dateFormatList = ["YYYY/MM/DD", "YYYY/MM/DD"];
  const navigate = useNavigate();

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onFinish = async (values) => {
    values = {
      ...values,
      gender: parseInt(values.gender),
      role: parseInt(values.role)
    };
    await createUser(values).then((data) => {
      console.log(data);
      setIsModalOpen(true);
    });
  };

  const handleCancel = () => {
    navigate("/admin/manage-user");
  };

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 7 }
  };

  const tailLayout = {
    wrapperCol: { offset: 9 }
  };

  return (
    <>
      <h1 className="text-2xl text-red-600 font-bold mb-5">Create New User</h1>
      <Form {...layout} form={form} name="nest-messages" onFinish={onFinish}>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: FIRST_NAME_REQUIRED },
            {
              pattern: /^[A-Za-z ]*$/,
              message: NAME_ONLY_ALLOW
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: LAST_NAME_REQUIRED },
            {
              pattern: /^[A-Za-z ]*$/,
              message: NAME_ONLY_ALLOW
            }
          ]}
        >
          <Input />
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
                return Promise.reject(new Error(DOB_UNDER_18));
              }
            })
          ]}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={dateFormatList}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          className="text-red-600"
          rules={[{ required: true, message: GENDER_REQUIRED }]}
        >
          <Radio.Group name="gender">
            <ConfigProvider
              theme={{
                components: {
                  Radio: {
                    colorPrimary: "#FF0000"
                  }
                }
              }}
              name="gender"
            >
              <Radio value="1">Female</Radio>
              <Radio value="0">Male</Radio>
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
                return Promise.reject(new Error(JOINED_DATE_NOT_LATER_DOB));
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
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={dateFormatList}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Type"
          rules={[{ required: true, message: ROLE_REQUIRED }]}
        >
          <Select name="role">
            <Option value="0">Admin</Option>
            <Option value="1">Staff</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            className="mx-2"
            type="primary"
            danger
            onSubmit={onFinish}
            htmlType="submit"
          >
            Save
          </Button>
          <Button className="mx-3" danger onClick={handleCancel}>
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
        <p className="mb-8">User has been created successfully!</p>
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
