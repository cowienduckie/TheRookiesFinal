import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Tooltip, Modal, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";

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
  const [isSending, setIsSending] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(true);

  const onFinish = (values) => {
    if (isSending) return;

    setIsSending(true);

    logIn(loginInfo)
      .then((userInfo) => {
        authContext.setAuthInfo(userInfo.role, userInfo.token);
        setIsSending(false);
        navigate("/");
      })
      .catch((error) => {
        setIsSending(false);
        throw new Response("", {
          status: error.status,
          statusText: error.statusText,
        });
      });
  };

  const handleChange = (e)=>{
    const {name , value} = e.target
    console.log(name, value)
  }

  return (
    <>
      <Modal
        title="Login"
        open={isModalOpen}
        footer={false}
        closeIcon={
          <CloseOutlined
            onClick={() => {
              setIsModalOpen(false);
            }}
          />
        }
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
              onChange={handleChange}
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
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                danger
              >
                Log in
              </Button>
              <label> </label>
              <Button
                className="login-form-button"
                danger
                onClick={()=>{setIsModalOpen(false)}}
              >
                Cancel
              </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
