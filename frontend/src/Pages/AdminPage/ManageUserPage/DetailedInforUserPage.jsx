import { Divider, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../../Apis/AdminApis";

export function DetailedInforUserPage() {
  const [data, setData] = useState({});
  let { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await getUserById(id);
      setData(res);
    };

    loadData();
  }, []);

  return (
    <>
      <Modal open={isModalOpen} closable={false} footer={false}>
        <div className="flex justify-between">
          <h1 className="text-2xl text-red-600 font-bold">
            Detail User Information
          </h1>
          <button
            className="text-red-600"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <CloseOutlined />
          </button>
        </div>
        <Divider />
        <div>
          <table className="border-separate border-spacing-5 ml-10">
            <tbody>
              <tr>
                <td>Staff Code:</td>
                <td>{data.staffCode}</td>
              </tr>
              <tr>
                <td>Full Name:</td>
                <td>{data.fullName}</td>
              </tr>
              <tr>
                <td>User Name:</td>
                <td>{data.username}</td>
              </tr>
              <tr>
                <td>Date of birth:</td>
                <td>{data.dateOfBirth}</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{data.gender}</td>
              </tr>
              <tr>
                <td>Type:</td>
                <td>{data.role}</td>
              </tr>
              <tr>
                <td>Location:</td>
                <td>{data.location}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
