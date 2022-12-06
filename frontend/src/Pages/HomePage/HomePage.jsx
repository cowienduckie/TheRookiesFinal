import React from "react";
import { Table, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  CheckOutlined,
  ReloadOutlined,
  CloseOutlined
} from "@ant-design/icons";

export function HomePage() {
  const location = useLocation();

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      sorter: true,
      render: (text, record) => (
        <Link to={`/assignments/${record.id}`} state={{ background: location }}>
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
          <Link to={`/assignments/accept/${record.id}`} state={{ background: location }}>
            <Button
              className="ml-2"
              icon={<CheckOutlined className="align-left" />}
            />
          </Link>
          <Link to={`/assignments/decline/${record.id}`} state={{ background: location }}>
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
