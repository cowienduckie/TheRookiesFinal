import React from 'react'
import { Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'

export function ChangePasswordModal() {
  //const [isModalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate();

  const showModal = () => {
    navigate("/password-change")
    //setIsModalOpen(true)
  }

  return (
    <div className="dropdownLayout">
      <Tooltip onClick={showModal}>
        Change Password 
      </Tooltip>
    </div>
  )
}
