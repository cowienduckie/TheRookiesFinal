import { callApi } from "../Helpers/ApiHelper";
import { BASE_URL } from "../Constants/SystemConstants";

export async function logIn(loginInfo) {
  const url = `${BASE_URL}/api/authentication`;

  return await callApi("post", url, loginInfo);
}
