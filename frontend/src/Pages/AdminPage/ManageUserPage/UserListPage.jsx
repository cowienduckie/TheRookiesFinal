import { Button, Dropdown, Select, Table } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { FilterFilled } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserList } from "../../../Apis/UserApis";
import { queriesToString } from "../../../Helpers/ApiHelper";

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

  const handleTableChange = (pagination, filter, sorter) => {
    const newQueries = {
      ...queries,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.columnKey,
      sortDirection: sorter.order === "ascend" ? "1" : "0"
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

  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: "1",
      sorter: true,
      defaultSortOrder: "descend"
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "2",
      sorter: true,
      defaultSortOrder: "descend"
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "4",
      sorter: true,
      defaultSortOrder: "descend"
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      key: "5",
      sorter: true,
      defaultSortOrder: "descend"
    },
    {
      title: "Type",
      dataIndex: "role",
      key: "3",
      sorter: true,
      defaultSortOrder: "descend"
    }
  ];

  const filterItems = [
    {
      label: "Admin",
      key: "Admin"
    },
    {
      label: "Staff",
      key: "Staff"
    }
  ];

  const filterMenu = {
    items: filterItems
  };

  return (
    <>
      <h1 className="font-bold text-red-600 text-2xl">USER LIST</h1>
      <div className="flex flex-row py-5 w-full justify-between">
        <div className="w-full p-0">
          <Select
            defaultValue=""
            suffixIcon={<FilterFilled />}
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
        <div className="w-full p-0 flex flex-row justify-end">
          <Search className="mr-3" onSearch={onSearch} />
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
