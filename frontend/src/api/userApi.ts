import axios from "axios"
import { type LoginValue } from "../types/types"
axios.defaults.withCredentials = true;

export const loginUser = async (loginData: LoginValue) => {
  const response = await axios.post('http://localhost:4000/auth/login', loginData)
  if (!response.data.success) {
    console.log(response.data?.error)
    return response.data?.error;
  }
  return response.data.data;
}