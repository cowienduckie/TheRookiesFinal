import { Divider, Modal } from "antd";
import { useNavigate } from "react-router-dom";

export function DetailedInfoHomePage() {
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Modal
        open={true}
        closable={true}
        footer={false}
        onCancel={onCancel}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">
            Detailed Assignment Information
          </h1>
        </div>
        <Divider />
        <div>
          <table className="ml-5 border-separate border-spacing-3">
            <tbody>
              <tr>
                <td className="font-bold">Asset Code:</td>
                <td>00</td>
              </tr>
              <tr>
                <td className="font-bold">Asset Name:</td>
                <td>...</td>
              </tr>
              <tr>
                <td className="font-bold">Specification:</td> 
                <td>...</td>
              </tr>
              <tr>
                <td className="font-bold">Assigned to:</td>
                <td>...</td>
              </tr>
              <tr>
                <td className="font-bold">Assigned by:</td>
                <td>00/00/0000</td>
              </tr>
              <tr>
                <td className="font-bold">Assigned date:</td>
                <td>00/00/0000</td>
              </tr>
              <tr>
                <td className="font-bold">State:</td>
                <td>None</td>
              </tr>
              <tr>
                <td className="font-bold">Note:</td>
                <td>...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
