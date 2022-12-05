import { Button, Divider, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export function DeleteAssetPage() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isHistoricalAssignment, setIsHistoricalAssignment] = useState(true);

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <>
      {isHistoricalAssignment !== undefined &&
        isHistoricalAssignment !== null &&
        (!isHistoricalAssignment ? (
          <Modal open={isModalOpen} closable={false} footer={false} width={400}>
            <div className="flex content-center justify-between">
              <h1 className="pl-5 text-2xl font-bold text-red-600">
                Are you sure?
              </h1>
            </div>
            <Divider />
            <div className="pl-5 pb-5">
              <p className="mb-5 text-base">
                Do you want to delete this asset?
              </p>
              <Space className="mt-5">
                <Button
                  type="primary"
                  danger
                  className="mr-2"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </div>
          </Modal>
        ) : (
          <Modal open={isModalOpen} closable={true} footer={false} onCancel={onCancel}>
            <div className=" flex content-center justify-between">
              <h1 className="pl-5 text-2xl font-bold text-red-600">
                Cannot Delete Asset
              </h1>
            </div>
            <Divider />
            <div className="pl-5 pr-5 text-base">
              <p className=" leading-relaxed">
                Cannot delete the asset because it belongs to one or more
                historical assigments.
              </p>
              <p>
                If the asset is not able to be used anymore, please update its
                state in{" "}
                <Link
                  to=""
                  className="text-blue-600 underline decoration-sky-600"
                >
                  Edit Asset page
                </Link>
              </p>
            </div>
          </Modal>
        ))}
    </>
  );
}
