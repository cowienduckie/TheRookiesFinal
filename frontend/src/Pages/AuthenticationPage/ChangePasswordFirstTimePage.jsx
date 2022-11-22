import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../Apis/Accounts";
import { TOKEN_KEY } from "../../Constants/SystemConstants";

export function ChangePasswordFirstTimePage() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    console.log(localStorage.getItem(TOKEN_KEY));

    await changePassword({...values});

    navigate("/");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal title="Change Password" open={true} closable={false} footer={false}>
      <p>
        This is the first time you logged in.
        <br />
        You have to change your password to continue.
      </p>
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
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please input your password!",
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
          <Button type="primary" htmlType="submit" danger>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
