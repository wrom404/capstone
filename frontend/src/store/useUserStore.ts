import { create } from "zustand";

type UserRoleProps = {
  userRole: string | null;
  isLoading: boolean;
  setUserRole: (user: string | null) => void;
  initializeLoadingState: () => void;
};

const useUserStore = create<UserRoleProps>((set) => ({
  userRole: null,
  isLoading: true,

  setUserRole: (user) => set({ userRole: user }),

  initializeLoadingState: () => {
    // Simulate fetching from backend (you can replace this with an API call)
    setTimeout(() => {
      set({ isLoading: false }); // Change "admin" dynamically based on API response
    }, 100);
  },
}));

export default useUserStore;
