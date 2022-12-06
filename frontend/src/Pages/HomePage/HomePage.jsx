import { Button, Table } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  UndoOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getOwnedAssignmentList } from "../../Apis/AssignmentApis";
import { queryObjectToString } from "../../Helpers/ApiHelper";
import {
  ASSET_CODE_ENUM,
  ASSET_NAME_ENUM,
  ASSIGNED_DATE_ENUM,
  STATE_ENUM
} from "../../Constants/ModelFieldConstants";

function useLoader() {
  const { search } = useLocation();

  const [queries, setQueries] = useState({
    pageIndex: "",
    pageSize: "",
    sortField: "",
    sortDirection: ""
  });

  const [pagedData, setPagedData] = useState({
    items: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getList() {
      setLoading(true);

      const searchParams = new URLSearchParams(search);

      const pageIndex = searchParams.get("pageIndex") ?? "";
      const pageSize = searchParams.get("pageSize") ?? "";
      const sortField = searchParams.get("sortField") ?? "";
      const sortDirection = searchParams.get("sortDirection") ?? "";

      const queriesFromUrl = {
        pageIndex,
        pageSize,
        sortField,
        sortDirection
      };

      const queryString = queryObjectToString(queriesFromUrl);
      const data = await getOwnedAssignmentList(queryString);

      setQueries(queriesFromUrl);
      setPagedData({
        ...data.result,
        items: [...data.result.items]
      });
      setLoading(false);
    }
    getList();
  }, [search]);

  return { pagedData, queries, loading };
}

export function HomePage() {
  const { pagedData, queries, loading } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();

  const navigateByQueries = (queries) => {
    const queryString = queryObjectToString(queries);

    navigate(queryString);
  };

  const handleTableChange = (pagination, _, sorter) => {
    const newQueries = {
      ...queries,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.columnKey,
      sortDirection: sorter.order === "ascend" ? "0" : "1"
    };

    navigateByQueries(newQueries);
  };

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      key: ASSET_CODE_ENUM,
      sorter: true,
      render: (text, record) => (
        <Link
          to={`/admin/manage-assignment/${record.id}`}
          state={{ background: location }}
        >
          <p>{text}</p>
        </Link>
      )
    },
    {
      title: "Asset Name",
      dataIndex: "assetName",
      key: ASSET_NAME_ENUM,
      sorter: true,
      defaultSortOrder: "ascend"
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      key: ASSIGNED_DATE_ENUM,
      sorter: true
    },
    {
      title: "State",
      dataIndex: "state",
      key: STATE_ENUM,
      sorter: true
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      render: (_, record) => (
        <div className="flex min-w-fit flex-nowrap p-0">
          <Link
            to={`/assignments/accept/${record.id}`}
            state={{ background: location }}
          >
            <Button
              className="mr-1"
              danger
              icon={<CheckOutlined className="align-middle" />}
            />
          </Link>
          <Link
            to={`/assignments/decline/${record.id}`}
            state={{ background: location }}
          >
            <Button
              className="mx-1 border-gray-700"
              icon={<CloseOutlined className="align-middle text-gray-700" />}
            />
          </Link>
          <Button
            className="ml-1 border-blue-500"
            icon={<UndoOutlined className="align-middle text-blue-500" />}
          />
        </div>
      )
    }
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600 mb-5">My Assignment</h1>
      <Table
        columns={columns}
        dataSource={pagedData.items}
        rowKey={(item) => item.id}
        pagination={{
          current: pagedData.pageIndex,
          pageSize: pagedData.pageSize,
          total: pagedData.totalRecord
        }}
        loading={loading}
        onChange={handleTableChange}
        sortDirections={["ascend", "descend", "ascend"]}
        showSorterTooltip={false}
      />
    </>
  );
}
