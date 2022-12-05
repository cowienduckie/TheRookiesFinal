import { Button, Select, Table } from "antd";
import { FilterFilled, EditOutlined, CloseOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const { search, state } = useLocation();
  const navigate  = useNavigate();
  const newUser = state && state.newUser;
  const isReload = state && state.isReload;

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
      setPagedData({
        ...data.result,
        items: [...data.result.items]
      });
      setLoading(false);
    }
    getList();
  }, [search]);

  if (!!newUser &&
      pagedData.items.length > 0 &&
      pagedData.items[0].id !== newUser.id) {
    const duplicateId =  pagedData.items.findIndex((value) => value.id === newUser.id)

    if (duplicateId >= 0) {
      pagedData.items.splice(duplicateId, 1);
    }

    pagedData.items.unshift(newUser);
    window.history.replaceState({}, "");
  }

  if (!!isReload) {
    if (isReload) {
      navigate(0);
    }

    window.history.replaceState({}, "");
  }

  return { pagedData, queries, loading };
}

export function UserListPage() {
  const { pagedData, queries, loading } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();

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
      filterValue: !!value ? value : ""
    };

    navigateByQueries(newQueries);
  };

  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: STAFF_CODE_ENUM,
      sorter: true,
      render: (text, record) => (
        <Link
          to={`/admin/manage-user/${record.id}`}
          state={{ background: location }}
        >
          <p>{text}</p>
        </Link>
      )
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
      sorter: true
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: JOINED_DATE_ENUM,
      sorter: true
    },
    {
      title: "Type",
      dataIndex: "role",
      key: ROLE_ENUM,
      sorter: true
    },
    {
      title: "",
      dataIndex: "",
      key: "actions",
      render: (_, record) => (
        <div className="max-w-fit p-0">
          <Link to={`/admin/manage-user/edit-user/${record.id}`}>
            <Button
              className="mr-2"
              icon={<EditOutlined className="align-middle" />}
            />
          </Link>
          <Link
            to={`/admin/manage-user/disable/${record.id}`}
            state={{ background: location }}
          >
            <Button
              className="ml-2"
              danger
              icon={<CloseOutlined className="align-middle" />}
            />
          </Link>
        </div>
      )
    }
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600">User List</h1>
      <div className="flex w-full flex-row justify-between py-5">
        <div className="w-1/2 p-0">
          <Select
            className="w-3/12"
            allowClear
            placeholder="Type"
            suffixIcon={<FilterFilled className="align-middle" />}
            clearIcon={<CloseOutlined className="align-middle" />}
            onChange={onFilter}
            options={[
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
        <div className="flex w-1/2 flex-row justify-end p-0">
          <Search className="mr-3 w-1/3" onSearch={onSearch} />
          <Link to="/admin/manage-user/create-user">
            <Button className="ml-3" type="primary" danger>
              Create New User
            </Button>
          </Link>
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
