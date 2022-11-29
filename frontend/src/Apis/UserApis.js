import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/users`;

export async function getUserList(queries = "") {
  return await callApi("get", url + queries);
}
