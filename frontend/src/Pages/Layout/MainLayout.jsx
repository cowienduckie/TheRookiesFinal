import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import React, { useContext } from "react";
import "./MainLayout.css";
import nashLogo from "../../Assets/nashLogo.jpg";
import { DropdownLayout } from "./DropdownLayout";
import { AuthContext } from "../../Contexts/AuthContext";
import { ADMIN, STAFF } from "../../Constants/SystemConstants";

export function MainLayout() {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { Header, Content, Sider } = Layout;

  const adminPages = [
    { name: "Manage User", path: "/admin/manage-user" },
    { name: "Manage Asset", path: "/admin/manage-asset" },
    { name: "Manage Assignment", path: "/admin/manage-assignment" },
    {
      name: "Manage Returning",
      path: "/admin/manage-returning",
    },
    { name: "Report", path: "/admin/report" },
  ];

  const staffPages = [];

  return (
    <div>
      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: "crimson",
            minHeight: 65,
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

            <Menu theme="light" mode="inline" selectedKeys={location.pathname}>
              <Menu.Item className="menuItem" key="/">
                <Link to="/">Home</Link>
              </Menu.Item>

              {authContext.authenticated &&
                authContext.userRole === ADMIN &&
                adminPages.map((page) => (
                  <Menu.Item className="menuItem" key={page.path}>
                    <Link to={page.path}>{page.name}</Link>
                  </Menu.Item>
                ))}

              {authContext.authenticated &&
                authContext.userRole === STAFF &&
                staffPages.map((page) => (
                  <Menu.Item className="menuItem" key={page.path}>
                    <Link to={page.path}>{page.name}</Link>
                  </Menu.Item>
                ))}
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

        <Footer
          className="footerLayout"
          style={{
            backgroundColor: "red",
            color: "white",
          }}
        >
          NashTech2022 Part of Nash Squared.
        </Footer>
      </Layout>
    </div>
  );
}
