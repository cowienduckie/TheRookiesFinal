import { Divider, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function DetailedInfoHomePage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Modal
        open={showModal}
        closable={true}
        footer={false}
        onCancel={onCancel}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">
            Detailed Assigment Information
          </h1>
        </div>
        <Divider />
        <div>
          <table className="ml-10 border-separate border-spacing-5">
            <tbody>
              <tr>
                <td className="font-bold">Asset Code:</td>
              </tr>
              <tr>
                <td className="font-bold">Asset Name:</td>
              </tr>
              <tr>
                <td className="font-bold">Specification:</td> 
              </tr>
              <tr>
                <td className="font-bold">Assigned to:</td>
              </tr>
              <tr>
                <td className="font-bold">Assigned by:</td>
              </tr>
              <tr>
                <td className="font-bold">Assigned date:</td>
              </tr>
              <tr>
                <td className="font-bold">State:</td>
              </tr>
              <tr>
                <td className="font-bold">Note:</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
