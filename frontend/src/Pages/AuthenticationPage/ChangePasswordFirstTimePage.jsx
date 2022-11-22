import { Button, Divider, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../Apis/Accounts";
import { TOKEN_KEY } from "../../Constants/SystemConstants";
import {
  PASSWORD_REQUIRED,
  PASSWORD_AT_LEAST_ONE_DIGIT,
  PASSWORD_AT_LEAST_ONE_SPECIAL_CHARACTER,
  PASSWORD_AT_LEAST_ONE_LOWERCASE,
  PASSWORD_AT_LEAST_ONE_UPPERCASE,
  PASSWORD_RANGE_FROM_8_TO_16_CHARACTERS,
} from "../../Constants/ErrorMessages";

export function ChangePasswordFirstTimePage() {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    await changePassword({ ...values });

    navigate("/");
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
