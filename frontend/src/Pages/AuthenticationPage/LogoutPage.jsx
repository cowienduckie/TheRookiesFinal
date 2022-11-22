import React, { useState } from "react";
import { Modal, Button, Divider } from "antd";
import { AuthContext } from "../../Contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function LogoutPage() {
  const authContext = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const onLogOut = () => {
    authContext.clearAuthInfo();

    navigate("/login");

    setOpen(false);
  };

  const handleCancel = () => {
    navigate(-1);

    setOpen(false);
  };

  return (
    <>
      <Modal
        className="p-10"
        open={open}
        footer={false}
        closable={false}
      >
        <h1 className="text-2xl text-red-600 font-bold mb-5">Are you sure?</h1>
        <Divider />
        <p className="mb-8">Do you want to log out?</p>
        <div className="flex flex-row justify-center">
          <Button className="mx-2" type="primary" onClick={onLogOut} danger>
            Log Out
          </Button>
          <Button className="mx-2" onClick={handleCancel} danger>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
