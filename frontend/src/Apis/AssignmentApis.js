import { callApi, callApiTakeSuccessWrapper } from "../Helpers/ApiHelper";
import { API_BASE_URL } from "../Constants/SystemConstants";

const url = `${API_BASE_URL}/api/assignments`;

export async function getAssignmentList(queries = "") {
  return await callApi("get", url + queries);
}

export async function getAssignmentById(id) {
  return await callApi("get", url + "/" + id);
}

export async function getOwnedAssignmentList(queries = "") {
  return await callApi("get", url + "/owned-assignments" + queries);
}

export async function getOwnedAssignmentById(id) {
  return await callApi("get", url + "/owned-assignments/" + id);
}

export async function createAssignment(data) {
  return await callApi("post", url, data);
}

export async function respondAssignment(data) {
  return await callApi("put", url + "/response" , data);
}

export async function deleteAssignmentById(id) {
  return await callApiTakeSuccessWrapper("put", `${url}/delete`, id);
}