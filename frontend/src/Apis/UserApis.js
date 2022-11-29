import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/Users`;

export async function getUserList(queries = "") {
  return await callApi("get", url + queries);
}

export async function getUserById(userId) {
  return await callApi("get", url + "/" + userId);
}

export async function editUser(editModel) {
  return await callApi("put", url + "/edit", editModel);
}
