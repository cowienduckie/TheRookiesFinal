import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const urlGet = `${API_BASE_URL}/api/users`;
const urlPost = `${API_BASE_URL}/api/Users/create`;

export async function getUserList(queries = "") {
  return await callApi("get", urlGet + queries);
}

export async function createUser(data) {
  return await callApi("post", urlPost, data);
}

export async function getUserById(id) {
  const url = `${API_BASE_URL}/api/users/${id}`;

  return await callApi("get", url);
}