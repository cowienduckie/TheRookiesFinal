import axios from "axios";
import { TOKEN_KEY } from "../Constants/SystemConstants";

export async function callApi(method, url, data = null) {
  let response = undefined;

  await axios({
    method: method,
    url: url,
    headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    data: data
  })
    .then((result) => {
      response = result.data.data;
    })
    .catch((error) => {
      throw new Response("", {
        status: error.response.data.status,
        statusText: error.response.data.message
      });
    });

  return response;
}

export async function callApiTakeSuccessWrapper(method, url, data = null) {
  let response = undefined;

  await axios({
    method: method,
    url: url,
    headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    data: data
  })
    .then((result) => {
      response = result.data;
    })
    .catch((error) => {
      throw new Response("", {
        status: error.response.data.status,
        statusText: error.response.data.message
      });
    });

  return response;
}

export function queriesToString(queries) {
  return (
    "?" +
    `pageIndex=${queries.pageIndex}&` +
    `pageSize=${queries.pageSize}&` +
    `sortField=${queries.sortField}&` +
    `sortDirection=${queries.sortDirection}&` +
    `filterField=${queries.filterField}&` +
    `filterValue=${queries.filterValue}&` +
    `searchValue=${queries.searchValue}&`
  );
}

export function queryObjectToString(query) {
  var queryString = "?";

  for (let prop in query) {
    queryString += `${prop}=${query[prop]}&`;
  }

  return queryString
}

export function addQueryToString(queryString, queryName, queryValue) {
  return queryString + `${queryName}=${queryValue}&`;
}