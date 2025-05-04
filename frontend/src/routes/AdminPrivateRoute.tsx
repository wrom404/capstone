import useUserStore from "@/store/useUserStore";
import React from "react";
import { Navigate } from "react-router-dom";

type AdminProps = {
  children: React.ReactNode;
  roles: string[];
};

const AdminPrivateRoute = ({ roles, children }: AdminProps) => {
  const { userRole } = useUserStore(); // Get the current user's role from the store

  console.log(userRole);

  // Check if the user role is not in the allowed roles
  if (userRole && !roles.includes(userRole)) {
    console.log(`SET UP ROLE in frontend: ${roles}`);
    console.log(`ROLE from the backend: ${userRole}`);
    return <Navigate to={"/unauthorized"} replace />;
  }

  return children;
};

export default AdminPrivateRoute;
