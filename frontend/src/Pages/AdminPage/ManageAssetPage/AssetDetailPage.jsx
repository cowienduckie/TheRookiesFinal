import { Divider, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssetById } from "../../../Apis/AssetApis";

export function AssetDetailPage() {
  const [data, setData] = useState({});
  const { assetId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const res = await getAssetById(assetId);

      setData(res);
      setIsModalOpen(true);
    };

    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        closable={true}
        footer={false}
        onCancel={onCancel}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">
            Detailed Asset Information
          </h1>
        </div>
        <Divider />
        <div>
          <table className="ml-5 border-separate border-spacing-3">
            <tbody>
              <tr>
                <td className="font-bold">Asset Code:</td>
                <td>{data.assetCode}</td>
              </tr>
              <tr>
                <td className="font-bold">Asset Name:</td>
                <td>{data.name}</td>
              </tr>
              <tr>
                <td className="font-bold">Category:</td>
                <td>{data.category}</td>
              </tr>
              <tr>
                <td className="font-bold">Specification:</td>
                <td>{data.specification}</td>
              </tr>
              <tr>
                <td className="font-bold">Installed Date:</td>
                <td>{data.installedDate}</td>
              </tr>
              <tr>
                <td className="font-bold">State:</td>
                <td>{data.state}</td>
              </tr>
              <tr>
                <td className="font-bold">Location:</td>
                <td>{data.location}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
