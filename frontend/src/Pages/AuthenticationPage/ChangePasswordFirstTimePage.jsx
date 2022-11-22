import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../Apis/Accounts";
import { TOKEN_KEY } from "../../Constants/SystemConstants";

const titleStyles = {
  paddingLeft: "40px",
  color: "#eb1416",
  fontWeight: "700",
};

export function ChangePasswordFirstTimePage() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    console.log(localStorage.getItem(TOKEN_KEY));

    await changePassword({ ...values });

    navigate("/");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title={<p style={titleStyles}>Change Password</p>}
      open={true}
      closable={false}
      footer={false}
      bodyStyle={{ padding: "0 40px" }}
    >
      <p>
        This is the first time you logged in.
        <br />
        You have to change your password to continue.
      </p>
      <Form
        name="basic"
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
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" danger>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
