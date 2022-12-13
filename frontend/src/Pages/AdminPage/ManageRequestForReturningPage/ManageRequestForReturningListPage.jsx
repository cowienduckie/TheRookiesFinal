import { Button, DatePicker, Select, Table } from "antd";
import { FilterFilled, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRequestForReturningList } from "../../../Apis/RequestForReturningApis";
import { queryObjectToString } from "../../../Helpers/ApiHelper";
import {
  ACCEPTED_BY_ENUM,
  ASSET_CODE_ENUM,
  ASSET_NAME_ENUM,
  ASSIGNED_DATE_ENUM,
  REQUESTED_BY_ENUM,
  RETURNED_DATE_ENUM,
  STATE_ENUM
} from "../../../Constants/ModelFieldConstants";
import {
  COMPLETED,
  WAITING_FOR_RETURNING
} from "../../../Constants/RequestForReturningState";

const dateFormat = "DD/MM/YYYY";

function useLoader() {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const newRequest = state && state.newRequest;
  const isReload = state && state.isReload;

  const [queries, setQueries] = useState({
    pageIndex: "",
    pageSize: "",
    sortField: "",
    sortDirection: "",
    state: "",
    returnedDate: "",
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
      const state = searchParams.get("state") ?? "";
      const returnedDate = searchParams.get("returnedDate") ?? "";
      const searchValue = searchParams.get("searchValue") ?? "";

      const queriesFromUrl = {
        pageIndex,
        pageSize,
        sortField,
        sortDirection,
        state,
        returnedDate,
        searchValue
      };

      const queryString = queryObjectToString(queriesFromUrl);
      const data = await getRequestForReturningList(queryString);

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
    !!newRequest &&
    pagedData.items.length > 0 &&
    pagedData.items[0].id !== newRequest.id
  ) {
    const duplicateId = pagedData.items.findIndex(
      (value) => value.id === newRequest.id
    );

    if (duplicateId >= 0) {
      pagedData.items.splice(duplicateId, 1);
    }

    pagedData.items.unshift(newRequest);
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

export function ManageRequestForReturningListPage() {
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

  const onReturnedDateFilter = (value) => {
    const newQueries = {
      ...queries,
      returnedDate: !!value ? dayjs(value).format(dateFormat).toString() : ""
    };

    navigateByQueries(newQueries);
  };

  const onStateFilter = (value) => {
    const newQueries = {
      ...queries,
      state: !!value ? value : ""
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
      sorter: true
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
      title: "Requested By",
      dataIndex: "requestedBy",
      key: REQUESTED_BY_ENUM,
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
      title: "Accepted By",
      dataIndex: "acceptedBy",
      key: ACCEPTED_BY_ENUM,
      sorter: true
    },
    {
      title: "Returned Date",
      dataIndex: "returnedDate",
      key: RETURNED_DATE_ENUM,
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
            to={`/admin/manage-returning/complete-returning/${record.id}`}
            state={{ background: location }}
          >
            <Button
              className="mr-1 border-green-500 disabled:border-gray-200"
              disabled={record.state === COMPLETED}
              icon={
                <CheckOutlined
                  className={
                    record.state === COMPLETED
                      ? "align-middle text-gray-300"
                      : "align-middle text-green-500"
                  }
                />
              }
            />
          </Link>
          <Link
            to={`/admin/manage-returning/cancel-returning/${record.id}`}
            state={{ background: location }}
          >
            <Button
              className="mx-1"
              disabled={record.state === COMPLETED}
              danger
              icon={
                <CloseOutlined
                  className={
                    record.state === COMPLETED
                      ? "align-middle text-gray-300"
                      : "align-middle"
                  }
                />
              }
            />
          </Link>
        </div>
      )
    }
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600">Request List</h1>
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
                label: WAITING_FOR_RETURNING,
                value: WAITING_FOR_RETURNING
              },
              {
                label: COMPLETED,
                value: COMPLETED
              }
            ]}
          />
          <DatePicker
            className="ml-3 w-4/12 min-w-fit"
            allowClear
            placeholder="Returned Date"
            format={(date) => date.utc().format(dateFormat)}
            onChange={onReturnedDateFilter}
          />
        </div>
        <div className="flex w-1/2 flex-row justify-end p-0">
          <Search className="mr-3 w-1/3" onSearch={onSearch} />
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
