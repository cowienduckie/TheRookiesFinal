import { Button, Divider, Modal, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function AcceptAssignmentPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(true);

  const onCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };

  const handleAccept = async () => {
    enterLoading(0);
  };

  return (
    <>
      <Modal open={isModalOpen} closable={false} footer={false} width={400}>
        <div className="flex content-center justify-between">
          <h1 className="pl-5 text-2xl font-bold text-red-600">
            Are you sure?
          </h1>
        </div>
        <Divider />
        <div className="pl-5 pb-5">
          <p className="mb-5 text-base">
            Do you want to accept this assignment?
          </p>
          <Space className="mt-5">
            <Button
              type="primary"
              danger
              className="mr-2"
              loading={loadings[0]}
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </div>
      </Modal>
      ;
    </>
  );
}
