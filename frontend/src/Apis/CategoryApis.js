import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/categories`;

export async function getAllCategories() {
  return await callApi("get", url + "/all");
}

export async function createCategory(data) {
  return await callApi("post", url, data);
}