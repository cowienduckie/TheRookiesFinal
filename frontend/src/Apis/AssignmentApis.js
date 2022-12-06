import { callApi } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/assignments`;

export async function getAssignmentList(queries = "") {
  return await callApi("get", url + queries);
}

export async function getAssignmentById(id) {
  return await callApi("get", url + "/" + id);
}