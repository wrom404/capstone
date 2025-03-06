import axios from "axios"
import { type LoginValue } from "../types/types"

export const loginUser = async (loginData: LoginValue) => {
  const response = await axios.post('http://localhost:4000/api/login', loginData)
  return response.data;
}