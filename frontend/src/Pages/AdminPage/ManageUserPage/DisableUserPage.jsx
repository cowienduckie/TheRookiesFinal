import { Button, Divider, Modal, Space } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function DisableUserPage() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const assigment = false;

  const handleOnclick=()=>{
    setIsModalOpen(false);
    navigate(-1);
  }

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <>
      {assigment ? (
        <Modal
          open={isModalOpen}
          closable={true}
          footer={false}
          onCancel={onCancel}
        >
          <div className=" flex content-center justify-between">
            <h1 className="text-2xl font-bold text-red-600">
              Can not disable user
            </h1>
          </div>
          <Divider />
          <div className="text-xl">
            <p>There are valid assignments belonging to this user.</p>
            <p className="mt-2 mb-2">Please close all assignments before disabling user.</p>
          </div>
        </Modal>
      ) : (
        <Modal open={isModalOpen} closable={false} footer={false} width={400}>
          <div className="flex content-center justify-between">
            <h1 className="pl-5 text-2xl font-bold text-red-600">Are you sure?</h1>
          </div>
          <Divider />
          <div className="pl-5 pb-5">
            <p className="mb-5 text-xl">Do you want to disable this user?</p>
            <Space className="mt-5">
              <Button
                type="primary"
                danger
                onClick={handleOnclick}
                className="mr-5"
              >
                Disable
              </Button>
              <Button
                onClick={handleOnclick}
              >
                Cancel
              </Button>
            </Space>
          </div>
        </Modal>
      )}
    </>
  );
}
