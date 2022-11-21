import { DownOutlined } from '@ant-design/icons'
import './LayoutPage.css'
import { Row, Col, Dropdown, Space } from 'antd'
import { ChangePasswordModal } from '../../Components'
import { React } from 'react'

export function DropdownLayout() {
  const items = [
    {
      label: (
        <div>
          <ChangePasswordModal />
        </div>
      ),
      key: '0',
    },
    {
      label: <p>Login</p>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: 'Logout',
      key: '3',
    },
  ]

  return (
    <div className="dropdownLayout">
      <Row>
        <Col span={21}></Col>
        <Col span={2}>
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
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
    </div>
  )
}
