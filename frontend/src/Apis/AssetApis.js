import { callApi, callApiTakeSuccessWrapper } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/assets`;

export async function getAssetList(queries = "") {
  return await callApi("get", url + queries);
}

export async function getAssetById(id) {
  return await callApi("get", url + "/" + id);
}

export async function createAsset(data) {
  return await callApi("post", url, data);
}

export async function checkCanDeleteAsset(id) {
  return await callApiTakeSuccessWrapper(
    "get",
    `${url}/delete-availability/${id}`
  );
}

export async function deleteAsset(data) {
  return await callApiTakeSuccessWrapper("put", `${url}/delete`, data);
}