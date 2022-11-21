import { DownOutlined } from "@ant-design/icons";
import React from "react";
import "./MainLayout.css";
import { Row, Col, Modal, Form, Button, Input, Dropdown, Space } from "antd";
import { useState } from "react";
import { LogInModal } from "../../Components/Modal/LogInModal";

export function DropdownLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = [
    {
      label: <p onClick={showModal}>Change Password</p>,
      key: "0",
    },
    {
      label: <LogInModal />,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: 'Log Out',
      key: "3",
    },
  ];

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="dropdownLayout">
      <Row>
        <Col span={21}></Col>
        <Col span={2}>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <div className="dropdown">
              <div onClick={(e) => e.preventDefault()}>
                <Space className="dropdownText">
                  Login
                  <DownOutlined />
                </Space>
              </div>
            </div>
          </Dropdown>
        </Col>
      </Row>

      <Modal
        title="Change Password"
        open={isModalOpen}
        onOk={handleOk}
        closable={false}
        footer={[]}
      >
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
            label="Old Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please input your old password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
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
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>
            <label> </label>
            <Button type="primary" danger htmlType="submit" onClick={handleOk}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
