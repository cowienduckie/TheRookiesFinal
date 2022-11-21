import React, { useContext, useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { AuthContext } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../Apis/AuthenticationApis";

export function LoginPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [componentDisabled, setComponentDisabled] = useState(false);

  const onFinish = (values) => {
    logIn(values)
      .then((userInfo) => {
        authContext.setAuthInfo(userInfo.role, userInfo.token);

        if (userInfo.isFirstTimeLogin === false) {
          navigate("/change-password");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        throw new Response("", {
          status: error.status,
          statusText: error.statusText,
        });
      });
  };

  const handleOnClose = () => {
    navigate(-1);
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="Login"
      open={isModalOpen}
      footer={null}
      onCancel={handleOnClose}
      wrapClassName="modal-login"
    >
      <Form onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            danger
            disabled={componentDisabled}
          >
            Log in
          </Button>
          <Button danger onClick={handleOnClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
