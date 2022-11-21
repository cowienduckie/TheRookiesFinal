import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import React from "react";
import "./MainLayout.css";
import nashLogo from "../../Components/Logo/nashLogo.jpg";
import { DropdownLayout } from "./DropdownLayout";
import { useState } from "react";

export function MainLayout() {
  const location = useLocation();

  const { Header, Content, Sider } = Layout;

  const [current, ] = useState(location.pathname);

  return (
    <div>
      <Layout>
        <Header
          className="header"
          style={{
            padding: 0,
            backgroundColor: "red",
          }}
        >
          <DropdownLayout />
        </Header>
        <Layout className="LayoutContent">
          <Sider
            className="siderLayout"
            breakpoint="lg"
            collapsedWidth="0"
            theme="light"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="divLogo">
              <img alt="logoNashTech" src={nashLogo} className="logo"></img>
            </div>
            <div>
              <h4 className="title"> Online Asset Management</h4>
            </div>

            <Menu
              className="menuSider"
              theme="light"
              mode="inline"
              defaultSelectedKeys={[current]}
              selectedKeys={current.pathname}
            >
              <Menu.Item className="menuItem" key="/">
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/admin/user-management">
                <Link to="/admin/user-management">Manage User</Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/admin/asset-management">
                <Link to="/admin/asset-management">Manage Asset</Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/admin/assignment-management">
                <Link to="/admin/assignment-management">Manage Assignment</Link>
              </Menu.Item>
              <Menu.Item
                className="menuItem"
                key="/admin/returning-request-management"
              >
                <Link to="/admin/returning-request-management">
                  Request for Returning
                </Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/admin/report">
                <Link to="/admin/report">Report</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content
            style={{
              margin: "24px 16px 0",
            }}
          >
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 600,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
