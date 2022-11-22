import { DownOutlined } from '@ant-design/icons'
import React, { useContext } from 'react'
import './MainLayout.css'
import { Row, Col, Dropdown, Space } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext'

export function DropdownLayout() {
  const location = useLocation()
  const authContext = useContext(AuthContext)

  const items = [
    {
      label: (
        <Link to="/change-password" state={{ background: location }}>
          Change Password
        </Link>
      ),
      key: '0',
    },
    {
      label: (
        <Link to="/logout" state={{ background: location }}>
          Logout
        </Link>
      ),
      key: '1',
    },
  ]

  return (
    <Row>
      <Col span={21}></Col>
      <Col span={2}>
        {authContext.authenticated ? (
          <Dropdown menu={{ items }} trigger={['click']}>
            <div className="dropdown">
              <div onClick={(e) => e.preventDefault()}>
                <Space className="dropdownText">
                  {authContext.username}
                  <DownOutlined />
                </Space>
              </div>
            </div>
          </Dropdown>
        ) : (
          <Link to="/login" state={{ background: location }}>
            Login
          </Link>
        )}
      </Col>
    </Row>
  )
}
