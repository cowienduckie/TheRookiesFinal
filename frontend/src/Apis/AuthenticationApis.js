import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

export async function logIn(loginInfo) {
  const url = `${API_BASE_URL}/api/authentication`;

  return await callApi("post", url, loginInfo);
}
