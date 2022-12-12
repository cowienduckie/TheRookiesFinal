import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/requestsforreturning`;

export async function getRequestForReturningList(queries = "") {
  return await callApi("get", url + queries);
}
