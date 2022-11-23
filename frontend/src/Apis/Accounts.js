import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

export async function changePassword(data) {
  const url = `${API_BASE_URL}/api/accounts/password`;

  return await callApi("put", url, data);
}
