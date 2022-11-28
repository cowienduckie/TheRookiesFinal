import { Button, Select, Table } from "antd";
import { FilterFilled, EditOutlined, CloseOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserList } from "../../../Apis/UserApis";
import { queriesToString } from "../../../Helpers/ApiHelper";
import {
  FULL_NAME_ENUM,
  JOINED_DATE_ENUM,
  ROLE_ENUM,
  STAFF_CODE_ENUM,
  USERNAME_ENUM
} from "../../../Constants/ModelFieldConstants";

function useLoader() {
  const { search } = useLocation();

  const [queries, setQueries] = useState({
    pageIndex: "",
    pageSize: "",
    sortField: "",
    sortDirection: "",
    filterField: "",
    filterValue: "",
    searchValue: ""
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
      const filterField = searchParams.get("filterField") ?? "";
      const filterValue = searchParams.get("filterValue") ?? "";
      const searchValue = searchParams.get("searchValue") ?? "";

      const queriesFromUrl = {
        pageIndex,
        pageSize,
        sortField,
        sortDirection,
        filterField,
        filterValue,
        searchValue
      };

      const queryString = queriesToString(queriesFromUrl);
      const data = await getUserList(queryString);

      setQueries(queriesFromUrl);
      setPagedData(data.result);
      setLoading(false);
    }

    getList();
  }, [search]);

  return { pagedData, queries, loading };
}

export function UserListPage() {
  const { pagedData, queries, loading } = useLoader();
  const navigate = useNavigate();

  const navigateByQueries = (queries) => {
    const queryString = queriesToString(queries);

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

  const onSearch = (value) => {
    const newQueries = {
      ...queries,
      searchValue: value
    };

    navigateByQueries(newQueries);
  };

  const onFilter = (value) => {
    const newQueries = {
      ...queries,
      filterField: ROLE_ENUM,
      filterValue: value
    };

    navigateByQueries(newQueries);
  };

  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: STAFF_CODE_ENUM,
      sorter: true,
      defaultSortOrder: "ascend",
      render: (text) => <p className="cursor-pointer">{text}</p>
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: FULL_NAME_ENUM,
      sorter: true,
      defaultSortOrder: "ascend"
    },
    {
      title: "Username",
      dataIndex: "username",
      key: USERNAME_ENUM,
      sorter: true,
      defaultSortOrder: "ascend"
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: JOINED_DATE_ENUM,
      sorter: true,
      defaultSortOrder: "ascend"
    },
    {
      title: "Type",
      dataIndex: "role",
      key: ROLE_ENUM,
      sorter: true,
      defaultSortOrder: "ascend"
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      render: (_, record) => (
        <div className="max-w-fit">
          <Button
            className="mx-2"
            icon={<EditOutlined className="align-middle" />}
          />
          <Button
            className="mx-2"
            danger
            icon={<CloseOutlined className="align-middle" />}
          />
        </div>
      )
    }
  ];

  return (
    <>
      <h1 className="font-bold text-red-600 text-2xl">USER LIST</h1>
      <div className="flex flex-row py-5 w-full justify-between">
        <div className="w-1/2 p-0">
          <Select
            className="w-1/6"
            defaultValue=""
            suffixIcon={<FilterFilled />}
            onChange={onFilter}
            options={[
              {
                label: "Type",
                value: ""
              },
              {
                label: "Admin",
                value: "Admin"
              },
              {
                label: "Staff",
                value: "Staff"
              }
            ]}
          />
        </div>
        <div className="w-1/2 p-0 flex flex-row justify-end">
          <Search className="w-1/3 mr-3" onSearch={onSearch} />
          <Button className="ml-3" danger>
            Create New User
          </Button>
        </div>
      </div>
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