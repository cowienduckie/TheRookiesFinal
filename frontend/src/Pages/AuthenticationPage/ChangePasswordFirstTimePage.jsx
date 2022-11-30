import { Button, Divider, Form, Input, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../Apis/UserApis";
import { AuthContext } from "../../Contexts/AuthContext";
import {
  PASSWORD_REQUIRED,
  PASSWORD_AT_LEAST_ONE_DIGIT,
  PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER,
  PASSWORD_AT_LEAST_ONE_LOWERCASE,
  PASSWORD_AT_LEAST_ONE_UPPERCASE,
  PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS,
  PASSWORD_ONLY_ALLOW
} from "../../Constants/ErrorMessages";
import { CheckNullValidation } from "../../Helpers";
import { TOKEN_KEY } from "../../Constants/SystemConstants";

export function ChangePasswordFirstTimePage() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [form] = Form.useForm();
  const [backendError, setBackendError] = useState({
    isError: false,
    message: ""
  });

  useEffect(() => {
    if (!authContext.isFirstTimeLogin) {
      navigate("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    form.validateFields();
  }, [backendError]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = async (values) => {
    await changePassword({ ...values })
      .then(() => {
        authContext.setAuthInfo(
          authContext.username,
          authContext.userRole,
          localStorage.getItem(TOKEN_KEY),
          false
        );

        navigate("/");
      })
      .catch((error) => {
        setBackendError({ isError: true, message: error.statusText });
      });
  };

  return (
    <Modal open={true} closable={false} footer={false}>
      <h1 className="text-2xl text-red-600 font-bold mb-5">Change Password</h1>
      <Divider />
      <p className="mb-2">This is the first time you logged in.</p>
      <p className="mb-6">You have to change your password to continue.</p>
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            CheckNullValidation(PASSWORD_REQUIRED, "newPassword"),
            {
              pattern: /^(?=.*[0-9])[^\n]*$/,
              message: PASSWORD_AT_LEAST_ONE_DIGIT
            },
            {
              pattern: /^(?=.*[a-z])[^\n]*$/,
              message: PASSWORD_AT_LEAST_ONE_LOWERCASE
            },
            {
              pattern: /^(?=.*[A-Z])[^\n]*$/,
              message: PASSWORD_AT_LEAST_ONE_UPPERCASE
            },
            {
              pattern: /^(?=.*[!*_@#$%^&+=<>|.,:;"'{})(-/`~])[^\n]*$/,
              message: PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER
            },
            {
              pattern: /^[A-Za-z0-9!*_@#$%^&+=<>|.,:;"'{})(-/`~]*$/,
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
            onChange={() => {
              if (backendError.isError)
                setBackendError({ isError: false, message: "" });
            }}
          />
        </Form.Item>
        <Form.Item shouldUpdate style={{ textAlign: "right" }}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              danger
              disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length > 0
              }
            >
              Save
            </Button>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}