import { BASE_URL } from "../Constants/SystemConstants";
import { callApi } from "../Helpers/ApiHelper";

const url = `${BASE_URL}/api/books`;

export async function getBookById(id) {
  return await callApi("get", url + "/" + id);
}