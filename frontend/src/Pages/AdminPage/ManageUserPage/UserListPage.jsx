import { Table } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserList } from "../../../Apis/UserApis";
import { queriesToString } from "../../../Helpers/ApiHelper";

function useLoader() {
  const { search } = useLocation();

  const [loaderData, setLoaderData] = useState({
    wrapper: null
  });

  useEffect(() => {
    async function getList() {
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
      }
    
      const queryString = queriesToString(queriesFromUrl);
      const wrapper = await getUserList(queryString);
    
      setLoaderData({ wrapper: wrapper });
    }

    getList();
  }, [search])

  return loaderData;
}

export function UserListPage() {
  const { wrapper } = useLoader();
  const navigate = useNavigate();

  console.log(wrapper);

  // const [queries, setQueries] = useState({
  //   pageIndex: wrapper.pagingQuery.pageIndex,
  //   pageSize: wrapper.pagingQuery.pageSize,
  //   sortField: wrapper.sortQuery.sortField,
  //   sortDirection: wrapper.sortQuery.sortDirection,
  //   filterField: wrapper.filterQuery.filterField,
  //   filterValue: wrapper.filterQuery.filterValue,
  //   searchValue: wrapper.searchQuery.searchValue
  // });

  // useEffect(() => {
  //   const queryString = queriesToString(queries);

  //   navigate(queryString);
  // }, [queries]); // eslint-disable-line react-hooks/exhaustive-deps

  // const handleQueriesChange = (newState) => {
  //   setQueries(newState);
  // };

  return (
    <Table
    />
  );
}
