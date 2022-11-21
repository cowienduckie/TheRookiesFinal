import React, { useState } from "react";
import { Tooltip, Modal } from "antd";
import { AuthContext } from "../../Contexts/AuthContext";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

export function Modals(props) {
  const authContext = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const onLogOut = () => {
    console.log("logging out")
    authContext.clearAuthInfo();
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
        onOk= {<Link as={NavLink} to="/" onClick={onLogOut} />}
        onCancel={handleCancel}
      >
        <p>Do you want to log out?</p>
      </Modal>
    </>
  );
}
