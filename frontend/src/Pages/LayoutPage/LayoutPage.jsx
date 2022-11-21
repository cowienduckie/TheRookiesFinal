import { Link, Outlet, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import React from 'react'
import './LayoutPage.css'
import nashLogo from '../../Components/Logo/nashLogo.jpg'
import { DropdownLayout } from './DropdownLayout'
import { useEffect, useState } from 'react'

const { Header, Content, Footer, Sider } = Layout

export function LayoutPage() {
  let location = useLocation()
  const [current, setCurrent] = useState(location.pathname)
  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(location.pathname)
      }
    }
  }, [location, current])
  function handleClick(e) {
    setCurrent(e.key)
  }

  return (
    <div>
      <Layout>
        <Header
          className="header"
          style={{
            padding: 0,
            backgroundColor: 'red',
          }}
        >
          <div>
            <DropdownLayout />
          </div>
        </Header>
        <Layout className="LayoutContent">
          <Sider
            className="siderLayout"
            breakpoint="lg"
            collapsedWidth="0"
            theme="light"
            onBreakpoint={(broken) => {
              console.log(broken)
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type)
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
              onClick={handleClick}
            >
              <Menu.Item className="menuItem" key="/">
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/user-management">
                <Link to="/user-management">Manage User</Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/asset-management">
                <Link to="/asset-management">Manage Asset</Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/assignment-management">
                <Link to="/assignment-management">Manage Assignment</Link>
              </Menu.Item>
              <Menu.Item
                className="menuItem"
                key="/returning-request-management"
              >
                <Link to="/returning-request-management">
                  Request for Returning
                </Link>
              </Menu.Item>
              <Menu.Item className="menuItem" key="/report">
                <Link to="/report">Report</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content
            style={{
              margin: '24px 16px 0',
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
            backgroundColor: 'red',
            color: 'white',
          }}
        >
          NashTech2022 Part of Nash Squared.
        </Footer>
      </Layout>
    </div>
  )
}
