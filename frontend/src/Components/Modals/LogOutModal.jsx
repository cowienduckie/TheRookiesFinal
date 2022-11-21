import React from "react";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

export function LogOutModal(props) {

  const navigate = useNavigate();

  const showModal = () => {
    navigate("/logout")
  }

  return (
    <>
      <Tooltip type="primary" onClick={showModal}>
        Log Out
      </Tooltip>
    </>
  );
}
