// only logged in user can access

import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

type ProtectedProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedProps) => {
  const { userRole, isLoading } = useUserStore(); // Ensure `isLoading` is implemented in the store

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  if (!userRole || userRole === "") {
    toast.error("Unauthorized user. Please login.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
