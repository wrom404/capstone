// only logged in user can access

import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

type ProtectedProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedProps) => {
  const { userRole } = useUserStore();

  if (!userRole && userRole === "") {
    toast.error("Unauthorized user. PLease login.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
