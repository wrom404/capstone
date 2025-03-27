import { create } from "zustand"

type UserRoleProps = {
  userRole: string | null;
  setUserRole: (user: string | null) => void;
  isLoading: boolean;
}

const useUserStore = create<UserRoleProps>((set) => ({
  userRole: "",
  isLoading: true,
  setUserRole: (user) => {
    set({ userRole: user });
    set({ isLoading: false });
  }
}))

export default useUserStore
