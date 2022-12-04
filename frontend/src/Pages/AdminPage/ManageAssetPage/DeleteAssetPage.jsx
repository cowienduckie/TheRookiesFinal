import { Button, Divider, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function DeleteAssetPage() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  

  return (
    <>
      <Modal open={true} closable={false} footer={false} width={400}>
        <div className="flex content-center justify-between">
          <h1 className="pl-5 text-2xl font-bold text-red-600">
            Are you sure?
          </h1>
        </div>
        <Divider />
        <div className="pl-5 pb-5">
          <p className="mb-5 text-base">Do you want to delete this asset?</p>
          <Space className="mt-5">
            <Button
              type="primary"
              danger
              className="mr-2"
              
            >
              Disable
            </Button>
            <Button>Cancel</Button>
          </Space>
        </div>
      </Modal>

      {/* <Modal
            open={isModalOpen}
            closable={true}
            footer={false}
            onCancel={onCancel}
          >
            <div className=" flex content-center justify-between">
              <h1 className="text-2xl font-bold text-red-600">
                Cannot Delete Asset
              </h1>
            </div>
            <Divider />
            <p className="my-5 text-base leading-relaxed">
              Cannot delete the asset because it belongs to one or more historical assigments. <br />
              If the asset is not able to be used anymore, please update its state in Edit Asset page
            </p>
          </Modal> */}
    </>
  );
}
