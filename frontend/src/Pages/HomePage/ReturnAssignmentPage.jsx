import { Button, Divider, Modal, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { createRequestForReturning } from "../../Apis/RequestForReturningApis";

export function ReturnAssignmentPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(true);

  const { assignmentId } = useParams();

  const { userId } = useParams();

  const onCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const [loadings, setLoadings] = useState([]);

  const handleAccept = async () => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[1] = true;
      return newLoadings;
    });

    await createRequestForReturning({ assignmentId: assignmentId, requestedBy: userId })
      .then(() => {
        setIsModalOpen(false);
        navigate("/", { state: { isReload: true } });
      })
      .finally(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[1] = false;
          return newLoadings;
        });
      });
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
            Do you want to create a returning request for this asset?
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
            <Button onClick={onCancel}>No</Button>
          </Space>
        </div>
      </Modal>
      ;
    </>
  );
}
