import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Tooltip, Modal, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export function loader() {
  // TODO: Check if there is no token in local storage -> Redirect to Home
}

// TODO: Change password form here
export function ChangePasswordPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Modal
        title="Change Password"
        open={isModalOpen}
        footer={false}
      >
        <p>This is the first time you logged in.<br/>
        You have to change your password to continue.</p>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
