import React from "react";
import { Table, Button } from "antd";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  CheckOutlined,
  ReloadOutlined,
  CloseOutlined
} from "@ant-design/icons";

export function HomePage() {
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sorter: true,
      render: (text, record) => (
        <Link to={`/home-detail`} state={{ background: location }}>
          <p>{text}</p>
        </Link>
      )
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      sorter: true
    },
    {
      title: "",
      dataIndex: "",
      sorter: true
    },
    {
      title: "",
      dataIndex: "",
      sorter: true
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      render: (_, record) => (
        <div className="max-w-fit p-0">
          <Link to={`/accept-assigment`} state={{ background: location }}>
            <Button
              className="ml-2"
              icon={<CheckOutlined className="align-left" />}
            />
          </Link>
          <Link to={`/decline-assigment`} state={{ background: location }}>
            <Button
              className="ml-2"
              danger
              icon={<CloseOutlined className="align-middle" />}
            />
          </Link>
          <Button
            className="ml-2"
            icon={<ReloadOutlined className="align-right" />}
          />
        </div>
      )
    }
  ];
  const data = [
    {
      key: "1",
      assetCode: "03"
    }
  ];
  return (
    <>
      <h1 className="text-2xl font-bold text-red-600">My Assignment</h1>
      <Table columns={columns} dataSource={data} />
    </>
  );
}
