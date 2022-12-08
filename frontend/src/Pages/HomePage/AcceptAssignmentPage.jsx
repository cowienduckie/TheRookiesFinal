import { Button, Divider, Modal, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ACCEPTED_ENUM } from "../../Constants/AssignmentState";
import { respondAssignment } from "../../Apis/AssignmentApis";

export function AcceptAssignmentPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(true);

  const { assignmentId } = useParams();

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

    await respondAssignment({ id: assignmentId, state: ACCEPTED_ENUM })
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
            Do you want to accept this assignment?
          </p>
          <Space className="mt-5">
            <Button
              type="primary"
              danger
              className="mr-2"
              loading={loadings[1]}
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
