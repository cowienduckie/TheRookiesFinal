import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Modal } from "antd";
import { changePassword } from "../../Apis/Accounts";
import { TOKEN_KEY } from "../../Constants/SystemConstants";
import { AuthContext } from "../../Contexts/AuthContext";
import {
  PASSWORD_REQUIRED,
  PASSWORD_AT_LEAST_ONE_DIGIT,
  PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER,
  PASSWORD_AT_LEAST_ONE_LOWERCASE,
  PASSWORD_AT_LEAST_ONE_UPPERCASE,
  PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS,
} from "../../Constants/ErrorMessages";

export function ChangePasswordPage() {
  const authContext = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [componentDisabled] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);
  const [status, setStatus] = useState();
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
    console.log(values);
    console.log(localStorage.getItem(TOKEN_KEY));

    await changePassword({ ...values })
      .then(() => {
        setModalFinished(true);
      })
      .catch((error) => {
        if (error) {
          setStatus("Fail: Invalid old password !");
          console.log(error);
        }
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Change Password"
      open={isModalOpen}
      onCancel={handleCancel}
      closable={false}
      footer={[]}
    >
      {modalFinished === false && (
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
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary"
              danger
              disabled={componentDisabled}
              onSubmit={handleSubmit}
              htmlType="submit"
            >
              Save
            </Button>
            <label> </label>
            <Button danger key="back" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
          <p style={{ color: "red" }}>{status}</p>
        </Form>
      )}
      {modalFinished === true && (
        <div>
          <p>Your password has been changed successfully</p>
          <Button danger key="back" onClick={handleClose}>
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
}
