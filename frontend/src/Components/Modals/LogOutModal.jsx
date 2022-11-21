import React, { useState } from "react";
import { Tooltip, Modal } from "antd";
import { AuthContext } from "../../Contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function LogOutModal(props) { 
  const authContext = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onLogOut = () => {
    console.log("Logging out")
    authContext.clearAuthInfo();
    navigate('/login')
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    console.log("Cancel");
    setOpen(false);
  };

  return (
    <>
      <Tooltip type="primary" onClick={showModal}>
        Log Out
      </Tooltip>
      <Modal
        title="Are you sure"
        open={open}
        onOk={onLogOut}
        onCancel={handleCancel}
      >
        <p>Do you want to log out?</p>
      </Modal>
    </>
  );
}