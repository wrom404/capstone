import { create } from "zustand"

type UserRoleProps = {
  userRole: string | null;
  setUserRole: (user: string) => void;
}

const useUserStore = create<UserRoleProps>((set) => ({
  userRole: "",
  setUserRole: (user: string) => set({ userRole: user })
}))

export default useUserStore
