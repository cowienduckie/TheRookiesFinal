import { callApi } from '../Helpers/ApiHelper'
import { BASE_URL } from '../Constants/SystemConstants'

export async function changePassword(data) {
  const url = `${BASE_URL}/api/accounts/password`

  return await callApi('put', url, data)
}
