import { Button, Select, Table } from "antd";
import { FilterFilled, EditOutlined, CloseOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAssetList } from "../../../Apis/AssetApis";
import { queryObjectToString } from "../../../Helpers/ApiHelper";
import {
  ASSET_CODE_ENUM,
  CATEGORY_ENUM,
  NAME_ENUM,
  STATE_ENUM
} from "../../../Constants/ModelFieldConstants";
import { getAllCategories } from "../../../Apis/CategoryApis";
import { ASSIGNED } from "../../../Constants/AssetStates";

function useLoader() {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const newAsset = state && state.newAsset;
  const isReload = state && state.isReload;

  const [queries, setQueries] = useState({
    pageIndex: "",
    pageSize: "",
    sortField: "",
    sortDirection: "",
    assetState: "",
    category: "",
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
      const assetState = searchParams.get("assetState") ?? "";
      const category = searchParams.get("category") ?? "";
      const searchValue = searchParams.get("searchValue") ?? "";

      const queriesFromUrl = {
        pageIndex,
        pageSize,
        sortField,
        sortDirection,
        assetState,
        category,
        searchValue
      };

      const queryString = queryObjectToString(queriesFromUrl);
      const data = await getAssetList(queryString);

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
    !!newAsset &&
    pagedData.items.length > 0 &&
    pagedData.items[0].id !== newAsset.id
  ) {
    const duplicateId = pagedData.items.findIndex(
      (value) => value.id === newAsset.id
    );

    if (duplicateId >= 0) {
      pagedData.items.splice(duplicateId, 1);
    }

    pagedData.items.unshift(newAsset);
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

export function AssetListPage() {
  const { pagedData, queries, loading } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const res = await getAllCategories();

      setCategoryList(res);
    };

    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const onCategoryFilter = (value) => {
    const newQueries = {
      ...queries,
      category: !!value ? value : ""
    };

    navigateByQueries(newQueries);
  };

  const onStateFilter = (value) => {
    const newQueries = {
      ...queries,
      assetState: !!value ? value : ""
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
          to={`/admin/manage-asset/${record.id}`}
          state={{ background: location }}
        >
          <p>{text}</p>
        </Link>
      )
    },
    {
      title: "Asset Name",
      dataIndex: "name",
      key: NAME_ENUM,
      sorter: true,
      defaultSortOrder: "ascend"
    },
    {
      title: "Category",
      dataIndex: "category",
      key: CATEGORY_ENUM,
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
        <div className="max-w-fit p-0">
          <Button
            className="mr-2"
            icon={<EditOutlined className="align-middle" />}
          />
           <Button
            className="ml-2"
            disabled={record.state === ASSIGNED}
            danger
            icon={
              <CloseOutlined
                className={
                  record.state === ASSIGNED
                    ? "align-middle text-gray-300"
                    : "align-middle"
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
      <h1 className="text-2xl font-bold text-red-600">Asset List</h1>
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
                label: "Available",
                value: "Available"
              },
              {
                label: "Not available",
                value: "Not available"
              },
              {
                label: "Assigned",
                value: "Assigned"
              },
              {
                label: "Waiting for recycling",
                value: "Waiting for recycling"
              },
              {
                label: "Recycled",
                value: "Recycled"
              }
            ]}
          />
          <Select
            className="ml-3 w-3/12 min-w-fit"
            popupClassName="min-w-fit"
            allowClear
            placeholder="Category"
            suffixIcon={<FilterFilled className="align-middle" />}
            clearIcon={<CloseOutlined className="align-middle" />}
            onChange={onCategoryFilter}
            options={categoryList.map((value) => ({
              label: value.name,
              value: value.name
            }))}
          />
        </div>
        <div className="flex w-1/2 flex-row justify-end p-0">
          <Search className="mr-3 w-1/3" onSearch={onSearch} />
          <Link to="/admin/manage-asset/create-asset">
            <Button className="ml-3" type="primary" danger>
              Create New Asset
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
