import { Button, Modal, Table } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAssetList } from "../../../Apis/AssetApis";
import {
  ASSET_CODE_ENUM,
  CATEGORY_ENUM,
  NAME_ENUM
} from "../../../Constants/ModelFieldConstants";
import { queryObjectToString } from "../../../Helpers/ApiHelper";

function useLoader() {
  const { search } = useLocation();

  const [queries, setQueries] = useState({
    pageIndex: "",
    pageSize: "",
    sortField: "",
    sortDirection: "",
    assetState: "Available",
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
      const assetState = searchParams.get("assetState") ?? "Available";
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

  return { pagedData, queries, loading };
}

export function AssetListModal() {
  const { pagedData, queries, loading } = useLoader();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState();

  const navigateByQueries = (queries) => {
    const queryString = queryObjectToString(queries);

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
      state: { asset: selectedAsset }
    });
  };

  const columns = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      key: ASSET_CODE_ENUM,
      sorter: true
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
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedAsset(selectedRows[0]);
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
        <h1 className="text-2xl font-bold text-red-600">Select Asset</h1>
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
