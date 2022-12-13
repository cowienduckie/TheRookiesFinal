import { Button, DatePicker, Select, Table } from "antd";
import {
  FilterFilled,
  EditOutlined,
  CloseOutlined,
  UndoOutlined
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAssignmentList } from "../../../Apis/AssignmentApis";
import { queryObjectToString } from "../../../Helpers/ApiHelper";
import {
  ASSET_CODE_ENUM,
  ASSET_NAME_ENUM,
  ASSIGNED_BY_ENUM,
  ASSIGNED_DATE_ENUM,
  ASSIGNED_TO_ENUM,
  STATE_ENUM
} from "../../../Constants/ModelFieldConstants";
import {
  ACCEPTED,
  DECLINED,
  WAITING_FOR_ACCEPTANCE
} from "../../../Constants/AssignmentState";

const dateFormat = "DD/MM/YYYY";

function useLoader() {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const newAssignment = state && state.newAssignment;
  const isReload = state && state.isReload;

  const [queries, setQueries] = useState({
    pageIndex: "",
    pageSize: "",
    sortField: "",
    sortDirection: "",
    assignmentState: "",
    assignedDate: "",
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
      const assignmentState = searchParams.get("assignmentState") ?? "";
      const assignedDate = searchParams.get("assignedDate") ?? "";
      const searchValue = searchParams.get("searchValue") ?? "";

      const queriesFromUrl = {
        pageIndex,
        pageSize,
        sortField,
        sortDirection,
        assignmentState,
        assignedDate,
        searchValue
      };

      const queryString = queryObjectToString(queriesFromUrl);
      const data = await getAssignmentList(queryString);

      setQueries(queriesFromUrl);
      setPagedData({
        ...data.result,
        items: [...data.result.items]
      });
      setLoading(false);
    }
    getList();
  }, [search]);

  if (
    !!newAssignment &&
    pagedData.items.length > 0 &&
    pagedData.items[0].id !== newAssignment.id
  ) {
    const duplicateId = pagedData.items.findIndex(
      (value) => value.id === newAssignment.id
    );

    if (duplicateId >= 0) {
      pagedData.items.splice(duplicateId, 1);
    }

    pagedData.items.unshift(newAssignment);
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

export function AssignmentListPage() {
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

  const onSearch = (value) => {
    const newQueries = {
      ...queries,
      searchValue: value
    };

    navigateByQueries(newQueries);
  };

  const onAssignedDateFilter = (value) => {
    const newQueries = {
      ...queries,
      assignedDate: !!value ? dayjs(value).format(dateFormat).toString() : ""
    };

    navigateByQueries(newQueries);
  };

  const onStateFilter = (value) => {
    const newQueries = {
      ...queries,
      assignmentState: !!value ? value : ""
    };

    navigateByQueries(newQueries);
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "",
      key: "sequence",
      render: (_, record, index) => {
        return (
          <p>{pagedData.pageSize * (pagedData.pageIndex - 1) + index + 1}</p>
        );
      }
    },
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
      defaultSortOrder: "ascend",
      ellipsis: true
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: ASSIGNED_TO_ENUM,
      sorter: true,
      ellipsis: true
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      key: ASSIGNED_BY_ENUM,
      sorter: true,
      ellipsis: true
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
          <Button
            className="mr-1"
            icon={<EditOutlined className="align-middle" />}
          />
          <Button
            className="mx-1"
            disabled={record.state === ACCEPTED}
            danger
            icon={
              <CloseOutlined
                className={
                  record.state === ACCEPTED
                    ? "align-middle text-gray-300"
                    : "align-middle"
                }
              />
            }
            onClick={() => {
              navigate(
                `/admin/manage-assignment/delete-assignment/${record.id}`,
                {
                  state: { background: location }
                }
              );
            }}
          />

          <Button
            className="ml-1 border-blue-500 disabled:border-gray-200"
            disabled={record.state === WAITING_FOR_ACCEPTANCE}
            icon={
              <UndoOutlined
                className={
                  record.state === WAITING_FOR_ACCEPTANCE
                    ? "align-middle text-gray-300"
                    : "align-middle text-blue-500"
                }
              />
            }
          />
        </div>
      )
    }
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600">Assignment List</h1>
      <div className="flex w-full flex-row justify-between py-5">
        <div className="w-1/2 p-0">
          <Select
            className="mr-3 w-3/12 min-w-fit"
            popupClassName="min-w-fit"
            allowClear
            placeholder="State"
            suffixIcon={<FilterFilled className="align-middle" />}
            clearIcon={<CloseOutlined className="align-middle" />}
            onChange={onStateFilter}
            options={[
              {
                label: WAITING_FOR_ACCEPTANCE,
                value: WAITING_FOR_ACCEPTANCE
              },
              {
                label: ACCEPTED,
                value: ACCEPTED
              },
              {
                label: DECLINED,
                value: DECLINED
              }
            ]}
          />
          <DatePicker
            className="ml-3 w-4/12 min-w-fit"
            allowClear
            placeholder="Assigned Date"
            format={(date) => date.utc().format(dateFormat)}
            onChange={onAssignedDateFilter}
          />
        </div>
        <div className="flex w-1/2 flex-row justify-end p-0">
          <Search className="mr-3 w-1/3" onSearch={onSearch} />
          <Link to="/admin/manage-assignment/create-assignment">
            <Button className="ml-3" type="primary" danger>
              Create New Assignment
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
