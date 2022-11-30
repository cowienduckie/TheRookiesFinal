import { Button, Divider, Modal, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function DisableUserPage() {
  let { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(true);
console.log(id);
  return (
    <>
      {/* <Modal open={isModalOpen} closable={false} footer={false}>
        <div className=" flex justify-between content-center">
          <h1 className="text-2xl text-red-600 font-bold">
            Can not disable user
          </h1>
          <button
            className="border-2 border-red-600 text-red-600 pb-1 pl-1 pr-1 rounded h-fit"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <CloseOutlined />
          </button>
        </div>
        <Divider />
        <div className="pl-12 pb-5">
          <p>There are valid assignments belonging to this user.</p>
          <p>Please close all assignments before disabling user.</p>
        </div>
      </Modal> */}
      <Modal open={isModalOpen} closable={false} footer={false}>
        <div className="pl-12 flex justify-between content-center">
          <h1 className="text-2xl text-red-600 font-bold">
            Are you sure?
          </h1>          
        </div>
        <Divider />
        <div className="pl-12 pb-5">
          <p className="mb-5">Do you want to disable this user?</p>
          <Space>
            <Button type="primary" danger onClick={()=>{setIsModalOpen(false)}}>Disable</Button>
            <Button onClick={()=>{setIsModalOpen(false)}}>Cancel</Button>
          </Space>
        </div>
      </Modal>
    </>
  );
}a
