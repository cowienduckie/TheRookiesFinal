import { Button, Divider, Modal, Space } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { approveRequestForReturning } from "../../../Apis/RequestForReturningApis";

export function ManageRequestForReturningCompletePage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loadings, setLoadings] = useState([]);

  const handleAccept = async () => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[1] = true;
      return newLoadings;
    });

    await approveRequestForReturning({
      id: id,
      isCompleted: true
    })
      .then(() => {
        setIsModalOpen(false);
        navigate("/admin/manage-returning", { state: { isReload: true } });
      })
      .finally(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[1] = false;
          return newLoadings;
        });
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        closable={handleCancel}
        footer={[]}
        className="w-fit"
      >
        <div className="flex content-center justify-between">
          <h1 className="pl-5 text-2xl font-bold text-red-600">
            Are you sure?
          </h1>
        </div>
        <Divider />
        <div className="pl-5 pb-5">
          <p className="mb-5 text-base">
            Do you want to mark this returning request as 'Completed' ?
          </p>
          <Space className="mt-5">
            <Button
              type="primary"
              danger
              className="mr-2"
              loading={loadings[1]}
              onClick={handleAccept}
            >
              Yes
            </Button>
            <Button onClick={handleCancel}>No</Button>
          </Space>
        </div>
      </Modal>
    </>
  );
}
