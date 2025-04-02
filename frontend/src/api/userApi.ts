import axios from "axios"
import { type UserProps, type LoginValue, type CreateUserProps } from "../types/types"
axios.defaults.withCredentials = true;


export const loginUser = async (loginData: LoginValue) => {
  try {
    const response = await axios.post('http://localhost:4000/auth/login', loginData)

    if (!response.data.success) {
      console.log(response.data?.error)
      throw new Error(response.data?.error || "Login failed"); // 🔥 Throw an error
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
      throw new Error(error.response?.data?.error || "An error occurred"); // 🔥 Throw error
    } else {
      console.log("Unexpected Error: ", error)
      throw new Error("An unknown error occurred.");
    }
  }
}


export const logOutUser = async () => {
  try {
    const response = await axios.post('http://localhost:4000/auth/logout');
    if (!response.data.success) {
      console.log(response.data.message)
      throw new Error("Something went wrong.")
    }
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error?.message)
    } else {
      console.log("Unexpected error: ", error)
    }

    return "An unknown error occurred."
  }
}


export const createUser = async (newUser: CreateUserProps): Promise<CreateUserProps | null> => {

  try {
    console.log("new user: ", newUser)
    const response = await axios.post('http://localhost:4000/auth/sign-up', newUser);

    if (!response.data.success) {
      console.log(response.data?.message)
      throw new Error("Something went wrong");
    }
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error: ", error.message)
    } else {
      console.log("Unexpected error: ", error)
    }
    return null
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

