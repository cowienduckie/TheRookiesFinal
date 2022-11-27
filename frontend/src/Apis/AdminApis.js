import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

export async function getUserById(id) {
  const url = `${API_BASE_URL}/api/users/${id}`;

  return await callApi("get", url);
}
