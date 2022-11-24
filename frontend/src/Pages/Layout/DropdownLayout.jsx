import { CaretDownOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import "./MainLayout.css";
import { Dropdown, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";

export function DropdownLayout() {
  const location = useLocation();
  const authContext = useContext(AuthContext);

  const items = [
    {
      label: (
        <Link to="/change-password" state={{ background: location }}>
          <p className="my-2 mx-5">Change Password</p>
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link to="/logout" state={{ background: location }}>
          <p className="my-2 mx-5">Logout</p>
        </Link>
      ),
      key: "1",
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div className="cursor-pointer">
        <Space>
          <p className="text-white">
            {authContext.username} <CaretDownOutlined />
          </p>
        </Space>
      </div>
    </Dropdown>
  );
}
