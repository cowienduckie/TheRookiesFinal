import { Button, Divider, Form, Input, Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../Apis/Accounts";
import {
  INCORRECT_OLD_PASSWORD,
  PASSWORD_AT_LEAST_ONE_DIGIT,
  PASSWORD_AT_LEAST_ONE_LOWERCASE,
  PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER,
  PASSWORD_AT_LEAST_ONE_UPPERCASE,
  PASSWORD_COMPARED,
  PASSWORD_ONLY_ALLOW,
  PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS,
  PASSWORD_REQUIRED
} from "../../Constants/ErrorMessages";
import { AuthContext } from "../../Contexts/AuthContext";
import { CheckNullValidation } from "../../Helpers";

export function ChangePasswordPage() {
  const authContext = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [modalFinished, setModalFinished] = useState(false);
  const [isError, setIsError] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onLogOut = () => {
    authContext.clearAuthInfo();

    navigate("/login");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    onLogOut();
  };

  const handleSubmit = () => {
    setModalFinished(true);
  };

  useEffect(() => {
    form.validateFields();
  }, [isError, form]);

  const onFinish = async (values) => {
    await changePassword({ ...values })
      .then(() => {
        setModalFinished(true);
      })
      .catch((error) => {
        setIsError(true);
      });
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      closable={handleCancel}
      footer={null}
    >
      <h1 className="text-2xl text-red-600 font-bold mb-5">Change Password</h1>
      <Divider className="mb-6" />
      {modalFinished === false && (
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          labelCol={{
            span: 8
          }}
          wrapperCol={{
            span: 16
          }}
        >
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              {
                min: 8,
                max: 16,
                message: PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS
              },
              {
                validator() {
                  if (!isError) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(INCORRECT_OLD_PASSWORD));
                }
              },
              CheckNullValidation(PASSWORD_REQUIRED, "oldPassword")
            ]}
          >
            <Input.Password
              onChange={() => {
                if (isError) setIsError(false);
              }}
              style={{ width: "80%" }}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            dependencies={["oldPassword"]}
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
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("oldPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(PASSWORD_COMPARED));
                }
              })
            ]}
          >
            <Input.Password style={{ width: "80%" }} />
          </Form.Item>
          <Form.Item className="mt-5" shouldUpdate>
            {() => (
              <div className="flex flex-row justify-end">
                <Button
                  className="mx-2"
                  type="primary"
                  danger
                  onSubmit={handleSubmit}
                  htmlType="submit"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  }
                >
                  Save
                </Button>
                <Button
                  className="mx-2"
                  danger
                  key="back"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      )}
      {modalFinished === true && (
        <>
          <p className="mb-8">Your password has been changed successfully</p>
          <Button danger key="back" onClick={handleClose}>
            Close
          </Button>
        </>
      )}
    </Modal>
  );
}
