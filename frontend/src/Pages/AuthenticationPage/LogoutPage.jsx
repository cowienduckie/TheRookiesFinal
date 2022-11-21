// TODO: Logout content here (content inside modal)
import React, { useState } from "react";
import { Modal, Button } from "antd";
import { AuthContext } from "../../Contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function LogoutPage() {
  const authContext = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const onLogOut = () => {
    console.log("Logging out");
    authContext.clearAuthInfo();
    navigate("/login");
    setOpen(false);
  };

  const handleCancel = () => {
    console.log("Cancel");
    navigate("/");
    setOpen(false);
  };
  
  return (
    <>
      <Modal
        title="Are you sure"
        open={open}
        footer={[
          <>
            <Button type="primary" onClick={onLogOut} danger>
              Log Out
            </Button>
            <Button onClick={handleCancel} >
              Cancel
            </Button>
          </>,
        ]}
      >
        <p>Do you want to log out?</p>
      </Modal>
    </>
  );
}