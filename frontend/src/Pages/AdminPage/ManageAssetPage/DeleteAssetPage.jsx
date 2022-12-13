import { Button, Divider, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { checkCanDeleteAsset, deleteAsset } from "../../../Apis/AssetApis";

export function DeleteAssetPage() {
  let { id } = useParams(); // eslint-disable-line
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [hasHistoricalAssignment, setHasHistoricalAssignment] = useState(); // eslint-disable-line
  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  useEffect(() => {
    async function checkValid() {
      var result = await checkCanDeleteAsset(id);

      if (result.isSuccess === true) {
        setHasHistoricalAssignment(true);
      } else {
        setHasHistoricalAssignment(false);
      }
    }

    checkValid();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onCancel = () => {
    navigate(-1);
  };

  const handleDelete = async ()=>{
    enterLoading();
    await deleteAsset({ id }).finally(() => {
      setIsModalOpen(false);
      navigate("/admin/manage-asset", { state: { isReload: true } });
    });
  }

  const handleCancel = ()=>{
    setIsModalOpen(false);
    navigate(-1)
  }

  return (
    <>
      {
        hasHistoricalAssignment !== undefined &&
        hasHistoricalAssignment !== null &&
        (hasHistoricalAssignment ? (
          <Modal open={isModalOpen} closable={false} footer={false} className="w-fit">
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
                  loading={loadings[0]}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Space>
            </div>
          </Modal>
        ) : (
          <Modal open={isModalOpen} closable={true} footer={false} onCancel={onCancel} className="w-fit">
            <div className=" flex content-center justify-between">
              <h1 className="pl-5 text-2xl font-bold text-red-600">
                Cannot Delete Asset
              </h1>
            </div>
            <Divider />
            <div className="pl-5 pr-5 pb-2 text-lg">
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
