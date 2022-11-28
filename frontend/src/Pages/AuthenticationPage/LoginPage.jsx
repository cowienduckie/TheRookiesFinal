import React, { useContext, useEffect, useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined
} from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { AuthContext } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../Apis/AuthenticationApis";
import nashLogo from "../../Assets/nashLogo.jpg";
import {
  PASSWORD_ONLY_ALLOW,
  PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS,
  PASSWORD_REQUIRED,
  USERNAME_REQUIRED
} from "../../Constants/ErrorMessages";
import { CheckNullValidation } from "../../Helpers/InputValidations";

export function LoginPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [backendError, setBackendError] = useState({
    isError: false,
    message: ""
  });

  useEffect(() => {
    if (authContext.authenticated) {
      navigate("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    form.validateFields();
  }, [backendError]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = (values) => {
    logIn(values)
      .then((userInfo) => {
        authContext.setAuthInfo(
          userInfo.username,
          userInfo.role,
          userInfo.token,
          userInfo.isFirstTimeLogin
        );

        if (userInfo.isFirstTimeLogin) {
          navigate("/change-password-first-time");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        setBackendError({ isError: true, message: error.statusText });
      });
  };

  return (
    <div className="h-screen w-screen flex align-items-center bg-slate-100">
      <Card className="m-auto w-3/12 shadow-lg">
        <img className="w-1/2 m-auto mb-2" src={nashLogo} alt="Nash-Logo" />
        <Form
          form={form}
          layout="vertical"
          size="large"
          onChange={() => {
            if (backendError.isError)
              setBackendError({ isError: false, message: "" });
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                validator() {
                  if (backendError.isError) {
                    return Promise.reject(new Error(""));
                  } else {
                    return Promise.resolve();
                  }
                }
              },
              CheckNullValidation(USERNAME_REQUIRED, "username")
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Enter username"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              CheckNullValidation(PASSWORD_REQUIRED, "password"),
              {
                pattern:
                  /^(?=.*[A-Za-z0-9])[A-Za-z0-9!*_@#$%^&+=<>|.,:;"'{})(-/`~]*$/,
                message: PASSWORD_ONLY_ALLOW
              },
              {
                min: 8,
                max: 16,
                message: PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS
              },
              {
                validator() {
                  if (backendError.isError) {
                    return Promise.reject(new Error(backendError.message));
                  } else {
                    return Promise.resolve();
                  }
                }
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button
                className="w-full mt-5"
                type="primary"
                htmlType="submit"
                danger
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0
                }
              >
                LOGIN
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}