import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

export async function getUserById(data) {
  const url = `${API_BASE_URL}/api/users/${data}`;

  return await callApi("get", url, data);
}