import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import React from "react";
import "./MainLayout.css";
import nashLogo from "../../Assets/nashLogo.jpg";
import { DropdownLayout } from "./DropdownLayout";
import { CustomModal } from "../../Components";

export function MainLayout(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { Header, Content, Footer, Sider } = Layout;

  const adminPages = [
    { name: "Manage User", path: "/admin/user-management" },
    { name: "Manage Asset", path: "/admin/asset-management" },
    { name: "Manage Assignment", path: "/admin/assignment-management" },
    {
      name: "Manage Returning",
      path: "/admin/returning-request-management",
    },
    { name: "Report", path: "/admin/report" },
  ];

  const staffPages = [];

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
              selectedKeys={location.pathname}
            >
              <Menu.Item className="menuItem" key="/">
                <Link to="/">Home</Link>
              </Menu.Item>

              {adminPages.map((page) => (
                <Menu.Item className="menuItem" key={page.path}>
                  <Link to={page.path}>{page.name}</Link>
                </Menu.Item>
              ))}

              {staffPages.map((page) => (
                <Menu.Item className="menuItem" key={page.path}>
                  <Link to={page.path}>{page.name}</Link>
                </Menu.Item>
              ))}

              <Menu.Item className="menuItem" key="modal">
                <CustomModal
                  buttonText="Login"
                  modalTitle="Login"
                  onClick={() => { navigate("/login") }}
                  onClose={() => { navigate(-1) }}
                  location={location}>
                  <Outlet />
                </CustomModal>
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
              {props.children}
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
