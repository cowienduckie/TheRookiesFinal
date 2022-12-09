import { Button, Divider, Modal, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { respondAssignment } from "../../Apis/AssignmentApis";
import { DECLINED_ENUM } from "../../Constants/AssignmentState";

export function DeclineAssignmentPage() {
  const navigate = useNavigate();

  const { assignmentId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(true);

  const onCancel = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const [loadings, setLoadings] = useState([]);

  const handleDecline = async () => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[1] = true;
      return newLoadings;
    });

    await respondAssignment({ id: assignmentId, state: DECLINED_ENUM })
      .then(() => {
        setIsModalOpen(false);
        navigate("/", { state: { isReload : true } });
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
            Do you want to decline this assignment?
          </p>
          <Space className="mt-5">
            <Button
              type="primary"
              danger
              className="mr-2"
              loading={loadings[1]}
              onClick={handleDecline}
            >
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
