import { callApi } from "../Helpers/ApiHelper";
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