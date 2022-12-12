import { Button, Modal, Table } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserList } from "../../../Apis/UserApis";
import {
  FULL_NAME_ENUM,
  ROLE_ENUM,
  STAFF_CODE_ENUM
} from "../../../Constants/ModelFieldConstants";
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

export function UserListModal() {
  const { pagedData, queries, loading } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState();

  const navigateByQueries = (queries) => {
    const queryString = queriesToString(queries);

    navigate(queryString, { state: { background: location } });
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/admin/manage-assignment/create-assignment");
  };

  const handleSubmit = () => {
    setIsModalOpen(false);
    navigate("/admin/manage-assignment/create-assignment", {
      state: { user: selectedUser }
    });
  };

  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      key: STAFF_CODE_ENUM,
      sorter: true
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: FULL_NAME_ENUM,
      sorter: true,
      defaultSortOrder: "ascend",
      ellipsis: true
    },
    {
      title: "Type",
      dataIndex: "role",
      key: ROLE_ENUM,
      sorter: true
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUser(selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
      ...record
    })
  };

  return (
    <Modal
      open={isModalOpen}
      closable
      footer={false}
      className="w-7/12"
      onCancel={handleCloseModal}
    >
      <div className="mt-3 flex w-full flex-row justify-between py-5">
        <h1 className="text-2xl font-bold text-red-600">Select User</h1>
        <div className="flex w-1/2 flex-row justify-end p-0">
          <Search className="w-1/2" allowClear onSearch={onSearch} />
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
        scroll={{
          scrollToFirstRowOnChange: true,
          y: "50vh"
        }}
        rowSelection={{
          type: "radio",
          ...rowSelection
        }}
      />
      <div className="my-3 flex w-full flex-row justify-end">
        <Button
          className="mr-3 px-5"
          type="primary"
          danger
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button className="ml-3 px-5" onClick={handleCloseModal}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
