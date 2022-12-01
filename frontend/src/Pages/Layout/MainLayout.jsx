import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import React, { useContext, useEffect } from "react";
import nashLogo from "../../Assets/nashLogo.jpg";
import { DropdownLayout } from "./DropdownLayout";
import { AuthContext } from "../../Contexts/AuthContext";
import { ADMIN, STAFF } from "../../Constants/SystemConstants";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext.authenticated) {
      navigate("/login");
    }

    if (authContext.isFirstTimeLogin) {
      navigate("/change-password-first-time");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { Header, Content, Sider } = Layout;

  const adminPages = [
    { name: "Manage User", path: "/admin/manage-user" },
    { name: "Manage Asset", path: "/admin/manage-asset" },
    { name: "Manage Assignment", path: "/admin/manage-assignment" },
    {
      name: "Manage Returning",
      path: "/admin/manage-returning"
    },
    { name: "Report", path: "/admin/report" }
  ];

  const staffPages = [];

  return (
    <div>
      <Layout className="min-h-screen">
        <Header className="py-0 px-10 bg-red-700 min-h-fit flex flex-row justify-end">
          <DropdownLayout />
        </Header>
        <Layout className="min-w-full">
          <Sider
            className="bg-white min-w-min p-5"
            width="15%"
            breakpoint="xl"
            collapsedWidth="0"
            theme="light"
          >
            <img className="m-auto mt-5 w-3/4" src={nashLogo} alt="Nash-Logo" />
            <h1 className="text-red-600 font-bold text-xl text-center mb-8 whitespace-nowrap">
              Online Asset Management
            </h1>
            <Menu
              theme="light"
              mode="vertical"
              selectedKeys={"/" + location.pathname.split("/").slice(1,3).join("/")}
            >
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

          <Content className="bg-white min-h-full p-10">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
