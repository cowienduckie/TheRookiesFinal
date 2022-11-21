import { useNavigate } from "react-router-dom";
import React from "react";
import { Tooltip } from "antd";

export function LogInModal() {
  const navigation = useNavigate();

  const showModal = () => {
    navigation("/login");
  }

  return (
    <>
      <Tooltip type="primary" onClick={showModal}>
        Login
      </Tooltip>
    </>
  );
}