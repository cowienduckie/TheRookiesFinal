import { Button, Divider, Modal, Space } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function DisableUserPage() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const assigment = true;
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
          <div className="pl-12 pb-5">
            <p>There are valid assignments belonging to this user.</p>
            <p>Please close all assignments before disabling user.</p>
          </div>
        </Modal>
      ) : (
        <Modal open={isModalOpen} closable={false} footer={false}>
          <div className="flex content-center justify-between pl-12">
            <h1 className="text-2xl font-bold text-red-600">Are you sure?</h1>
          </div>
          <Divider />
          <div className="pl-12 pb-5">
            <p className="mb-5">Do you want to disable this user?</p>
            <Space>
              <Button
                type="primary"
                danger
                onClick={() => {
                  setIsModalOpen(false);
                  navigate("/admin/manage-user");
                }}
              >
                Disable
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  navigate("/admin/manage-user");
                }}
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
