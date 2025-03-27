import RoutePage from "./routes/Route";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useUserStore from "./store/useUserStore";
import useCurrentUser from "./hooks/useCurrentUser";

const App = () => {
  const { initializeLoadingState, setUserRole } = useUserStore();
  const { data: user, isPending, error } = useCurrentUser();

  useEffect(() => {
    initializeLoadingState(); // Initialize loading state
    
    if (user) {
      setUserRole(user.role); // Set user role
    }
  }, [initializeLoadingState, setUserRole, user]);

  if (isPending) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <span className="text-red-600 text-2xl">
          Error while fetching events
        </span>
      </div>
    );
  }

  return (
    <div>
      <RoutePage />
      <Toaster />
    </div>
  );
};

export default App;
