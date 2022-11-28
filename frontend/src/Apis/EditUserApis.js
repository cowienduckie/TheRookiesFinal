import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

export async function editUser(data) {
  const url = `${API_BASE_URL}/api/Users/edit`;

  return await callApi("put", url, data);
}