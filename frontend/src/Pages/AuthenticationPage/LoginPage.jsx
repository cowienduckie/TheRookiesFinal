import React, { useContext, useState } from "react";
import { LockOutlined, UserOutlined,EyeTwoTone,EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { AuthContext } from "../../Contexts/AuthContext";
import { redirect, useNavigate } from "react-router-dom";
import { TOKEN_KEY } from "../../Constants/SystemConstants";
import { logIn } from "../../Apis/AuthenticationApis";

export function loader() {
  // TODO: Check if there is token in local storage -> Redirect to Home
  if (localStorage.getItem(TOKEN_KEY) != null) {
    return redirect("/");
  }
}

// TODO: Login form here
export function LoginPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [componentDisabled, setComponentDisabled] = useState(false);

  const onFinish = (values) => {
    logIn(values)
      .then((userInfo) => {
        authContext.setAuthInfo(userInfo.role, userInfo.token);
        navigate("/");
      })
      .catch((error) => {
        throw new Response("", {
          status: error.status,
          statusText: error.statusText,
        });
      });
  };

  return (
    <>
      <Modal
        title="Login"
        open={isModalOpen}
        footer={null}
        closable={false}
        wrapClassName="modal-login"
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
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
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              danger
              disabled={componentDisabled}
            >
              Log in
            </Button>
            <label> </label>
            <Button
              danger
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
