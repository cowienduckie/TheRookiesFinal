import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

export async function createUser(data) {
  const url = `${API_BASE_URL}/api/Users/create`;

  return await callApi("post", url, data);
}