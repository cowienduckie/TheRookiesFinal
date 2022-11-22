import { DownOutlined } from "@ant-design/icons";
import React from "react";
import "./MainLayout.css";
import { Row, Col, Dropdown, Space } from "antd";
import { Link, useLocation } from "react-router-dom";

export function DropdownLayout() {
  const location = useLocation();

  const items = [
    {
      label: (
        <Link to="/change-password" state={{ background: location }}>
          Change Password
        </Link>
      ),
      key: "0",
    },
    {
      label: (
        <Link to="/login" state={{ background: location }}>
          Login
        </Link>
      ),
      key: "1",
    },
    {
      label: (
        <Link to="/logout" state={{ background: location }}>
          Logout
        </Link>
      ),
      key: "2",
    },
  ];

  return (
    <Row>
      <Col span={21}></Col>
      <Col span={2}>
        <Dropdown
          menu={{items}}
          trigger={["click"]}
        >
          <div className="dropdown">
            <div onClick={(e) => e.preventDefault()}>
              <Space className="dropdownText">
                Login
                <DownOutlined />
              </Space>
            </div>
          </div>
        </Dropdown>
      </Col>
    </Row>
  );
}
