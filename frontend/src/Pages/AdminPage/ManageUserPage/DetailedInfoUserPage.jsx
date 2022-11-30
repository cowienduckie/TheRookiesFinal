import { Divider, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../../Apis/UserApis";

export function DetailedInfoUserPage() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const res = await getUserById(id);

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
            Detail User Information
          </h1>
        </div>
        <Divider />
        <div>
          <table className="ml-10 border-separate border-spacing-5">
            <tbody>
              <tr>
                <td className="font-bold">Staff Code:</td>
                <td>{data.staffCode}</td>
              </tr>
              <tr>
                <td className="font-bold">Full Name:</td>
                <td>{data.fullName}</td>
              </tr>
              <tr>
                <td className="font-bold">User Name:</td>
                <td>{data.username}</td>
              </tr>
              <tr>
                <td className="font-bold">Date of birth:</td>
                <td>{data.dateOfBirth}</td>
              </tr>
              <tr>
                <td className="font-bold">Gender:</td>
                <td>{data.gender}</td>
              </tr>
              <tr>
                <td className="font-bold">Type:</td>
                <td>{data.role}</td>
              </tr>
              <tr>
                <td className="font-bold">Location:</td>
                <td>
                  {data.location === "HaNoi" ? "Ha Noi" : "Ho Chi Minh City"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
