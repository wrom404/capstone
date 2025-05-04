import axios from "axios"
import { type UserProps, type LoginValue, type CreateUserProps, type FetchedUserProps } from "../../types/types"
axios.defaults.withCredentials = true;


export const loginUser = async (loginData: LoginValue) => {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/login', loginData)

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
    const response = await axios.post('http://localhost:4000/api/auth/logout');
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
    const response = await axios.post('http://localhost:4000/api/auth/sign-up', newUser);

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

export const getAllUsers = async (): Promise<FetchedUserProps[] | null> => {
  try {
    const response = await axios.get('http://localhost:4000/api/auth/users');

    if (!response.data.success) {
      console.log(response.data?.message)
      throw new Error("Something went wrong");
    }
    return response.data.users;
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
    const response = await axios.get('http://localhost:4000/api/auth/current-user');

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

export const deleteUser = async (id: string): Promise<FetchedUserProps | null> => {
  if (!id) {
    throw new Error("Invalid id")
  }

  try {
    const response = await axios.delete(`http://localhost:4000/auth/api/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message)
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

export const updateUser = async ({ id, updatedUser }: { id: string, updatedUser: FetchedUserProps }): Promise<FetchedUserProps | null> => {
  if (!id) {
    throw new Error("Invalid id")
  }
  console.log("updatedUser: ", updatedUser)

  try {
    const response = await axios.put(`http://localhost:4000/api/auth/${id}`, updatedUser);

    if (!response.data.success) {
      throw new Error(response.data.message)
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


export const getUserById = async (id: string): Promise<FetchedUserProps | null> => {
  if (!id) {
    throw new Error("Invalid id")
  }

  try {
    const response = await axios.get(`http://localhost:4000/api/auth/${id}`);

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    console.log("response: ", response.data.user)

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