import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/users`;

export async function getUserList(queries = "") {
  return await callApi("get", url + queries);
}

export async function createUser(data) {
  return await callApi("post", url, data);
}

export async function getUserById(id) {
  return await callApi("get", url + "/" + id);
}

export async function changePassword(data) {
  return await callApi("put", url + "/change-password", data);
}

export async function editUser(editModel) {
  return await callApi("put", url , editModel);
}
