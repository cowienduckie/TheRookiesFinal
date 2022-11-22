import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Form, Input, Modal } from "antd";
import { changePassword } from "../../Apis/Accounts";
import { AuthContext } from "../../Contexts/AuthContext";
import {
  PASSWORD_REQUIRED,
  PASSWORD_AT_LEAST_ONE_DIGIT,
  PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER,
  PASSWORD_AT_LEAST_ONE_LOWERCASE,
  PASSWORD_AT_LEAST_ONE_UPPERCASE,
  PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS,
  INCORRECT_OLD_PASSWORD,
} from "../../Constants/ErrorMessages";

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
    navigate("/");
  };

  const handleClose = () => {
    setIsModalOpen(false);
    onLogOut();
  };

  const handleSubmit = () => {
    setModalFinished(true);
  };

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
      closable={false}
      footer={null}
    >
      <h1 className="text-2xl text-red-600 font-bold mb-5">Change Password</h1>
      <Divider className="mb-6" />
      {modalFinished === false && (
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: PASSWORD_REQUIRED,
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
                message: PASSWORD_REQUIRED,
              },
              {
                pattern: /^(?=.*[0-9])[A-Za-z0-9!*_@#$%^&+= ]*$/,
                message: PASSWORD_AT_LEAST_ONE_DIGIT,
              },
              {
                pattern: /^(?=.*[a-z])[A-Za-z0-9!*_@#$%^&+= ]*$/,
                message: PASSWORD_AT_LEAST_ONE_LOWERCASE,
              },
              {
                pattern: /^(?=.*[A-Z])[A-Za-z0-9!*_@#$%^&+= ]*$/,
                message: PASSWORD_AT_LEAST_ONE_UPPERCASE,
              },
              {
                pattern: /^(?=.*[!*_@#$%^&+= ]).*$/,
                message: PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER,
              },
              {
                min: 8,
                max: 16,
                message: PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <span className="text-red-600 text-sm" hidden={!isError}>
            {INCORRECT_OLD_PASSWORD}
          </span>
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
