import { Button, Divider, Modal, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkCanDisableUser, disableUser } from "../../../Apis/UserApis";

export function DisableUserPage() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isAbleToDisable, setIsAbleToDisable] = useState();
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
      var result = await checkCanDisableUser(id);

      if (result.isSuccess === true) {
        setIsAbleToDisable(true);
      } else {
        setIsAbleToDisable(false);
      }
    }

    checkValid();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDisable = async () => {
    enterLoading(0);
    await disableUser({ id }).finally(() => {
      setIsModalOpen(false);
      navigate("/admin/manage-user", { state: { isReload: true } });
    });
  };

  const handleOnclick = () => {
    setIsModalOpen(false);
    navigate(-1);
  };

  const onCancel = () => {
    navigate(-1);
  };

  return (
    <>
      {isAbleToDisable !== undefined &&
        isAbleToDisable !== null &&
        (isAbleToDisable ? (
          <Modal open={isModalOpen} closable={false} footer={false} width={400}>
            <div className="flex content-center justify-between">
              <h1 className="pl-5 text-2xl font-bold text-red-600">
                Are you sure?
              </h1>
            </div>
            <Divider />
            <div className="pl-5 pb-5">
              <p className="mb-5 text-base">
                Do you want to disable this user?
              </p>
              <Space className="mt-5">
                <Button
                  type="primary"
                  danger
                  className="mr-2"
                  loading={loadings[0]}
                  onClick={handleDisable}
                >
                  Disable
                </Button>
                <Button onClick={handleOnclick}>Cancel</Button>
              </Space>
            </div>
          </Modal>
        ) : (
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
            <p className="my-5 text-base leading-relaxed">
              There are valid assignments belonging to this user. <br />
              Please close all assignments before disabling user.
            </p>
          </Modal>
        ))}
    </>
  );
}
