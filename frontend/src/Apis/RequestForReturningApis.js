import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/requestsforreturning`;

export async function createRequestForReturning(data) {
  return await callApi("post", url, data);
}
