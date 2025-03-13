import axios from "axios"
import { type UserProps, type LoginValue } from "../types/types"
axios.defaults.withCredentials = true;

export const loginUser = async (loginData: LoginValue) => {
  try {
    const response = await axios.post('http://localhost:4000/auth/login', loginData)

    if (!response.data.success) {
      console.log(response.data?.error)
      return response.data?.error;
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected Error: ", error)
    }

    return "An unknown error occurred."
  }

}

export const currentUser = async (): Promise<UserProps | null> => {
  try {
    const response = await axios.get('http://localhost:4000/auth/current-user');

    if (!response.data.success) {
      console.log(response.data?.error)
      return response.data?.error;
    }
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected Error: ", error)
    }

    return null;
  }
}