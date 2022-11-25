import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  ConfigProvider,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function CreateUserPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate();

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    showModal();
  };

  const handleCancel = () => {
    navigate("/admin/manage-user");
  };

  const dateFormatList = ["YYYY/MM/DD", "YYYY/MM/DD"];

  const layout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 5,
    },
  };

  const tailLayout = {
    wrapperCol: {
      offset: 3,
    },
  };

  return (
    <>
      <h1 className="text-2xl text-red-600 font-bold mb-5">Create New User</h1>
      <Form
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="firstName"
          label="FirstName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="LastName"
          label="LastName"
          rules={[{ required: true }]}
        >
          <Input />
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
              },
            }),
          ]}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={dateFormatList}
          />
        </Form.Item>

        <Form.Item
          name="radio-button"
          label="Gender"
          className="text-red-600"
          rules={[{ required: true, message: "Please pick your gender!" }]}
        >
          <Radio.Group>
            <ConfigProvider
              theme={{
                components: {
                  Radio: {
                    colorPrimary: "#FF0000",
                  },
                },
              }}
            >
              <Radio value="Female">Female</Radio>
              <Radio value="Male">Male</Radio>
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
              },
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
              },
            }),
          ]}
        >
          <DatePicker
            disabledDate={disabledDate}
            style={{ width: "100%" }}
            format={dateFormatList}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please pick an user type!" }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="staff">Staff</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            className="mx-2"
            type="primary"
            danger
            onSubmit={handleSubmit}
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
