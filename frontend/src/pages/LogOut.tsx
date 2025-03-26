import useLogOutUser from "@/hooks/useLogOutUser";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const LogOut = () => {
  const { mutate: logoutUser, isSuccess, isPending, error } = useLogOutUser();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logout successfully");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

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
  return <div>LogOut</div>;
};

export default LogOut;
