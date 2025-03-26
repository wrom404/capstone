// only admin role can access the Private Route

import useUserStore from "@/store/useUserStore";
import React from "react";
import { Navigate } from "react-router-dom";

type AdminProps = {
  children: React.ReactNode;
  role: string;
};

const AdminPrivateRoute = ({ role, children }: AdminProps) => {
  const { userRole } = useUserStore();

  console.log(userRole);

  if (userRole && userRole !== role) {
    console.log(`SET UP ROLE in frontend: ${role}`);
    console.log(`ROLE from the backend${userRole}`);
    return <Navigate to={"/unauthorized"} replace />;
  }
  return children;
};

export default AdminPrivateRoute;
