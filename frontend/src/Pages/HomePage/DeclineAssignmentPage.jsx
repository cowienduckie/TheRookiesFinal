import { Button, Divider, Modal, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function DeclineAssignmentPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Modal open={showModal} closable={false} footer={false} width={400}>
        <div className="flex content-center justify-between">
          <h1 className="pl-5 text-2xl font-bold text-red-600">
            Are you sure?
          </h1>
        </div>
        <Divider />
        <div className="pl-5 pb-5">
          <p className="mb-5 text-base">Do you want to decline this assignment?</p>
          <Space className="mt-5">
            <Button type="primary" danger className="mr-2">
              Decline
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </div>
      </Modal>
      ;
    </>
  );
}
