import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import useCurrentUser from "@/hooks/user/useCurrentUser";
import UserProfileModal from "./UserProfileModal";

import { DropdownMenuCheckboxes } from "./DropDownComponent"; // Import the props type
import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { UserProps } from "@/types/types";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isPending, data: user, error } = useCurrentUser();
  const { setUserRole } = useUserStore();
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] =
    useState<boolean>(false);
  const [userData, setUserData] = useState<UserProps>({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
    create_at: new Date(),
  });

  useEffect(() => {
    if (user?.role) {
      setUserRole(user?.role);
    }
  }, [user, setUserRole]);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  if (error) {
    console.log(error);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("User data submitted: ", userData);
    // Add your submit logic here
  };

  return (
    <SidebarProvider className="w-full dark:bg-zinc-900 dark:text-gray-200">
      <div className="flex h-screen w-full bg-white dark:bg-zinc-900 dark:text-gray-200">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}

        <div className="flex-1 flex flex-col w-full dark:bg-zinc-900 dark:text-gray-200"> 
          <div className="border-b border-gray-300 dark:bg-zinc-900 dark:text-gray-200 dark:border-gray-800 py-2 flex justify-between w-full  text-gray-800">
            <SidebarTrigger className="p-4 hover:bg-indigo-200 dark:hover:bg-zinc-800" />
            <div className="">
              {isPending ? (
                ""
              ) : (
                <div className="flex items-center-500 mr-6 my-0.5">
                  <div className="bg-indigo-600 h-10 w-10 rounded-full text-xl font-bold border text-white flex items-center justify-center dark:bg-indigo-800 dark:text-gray-200">
                    {user?.first_name?.slice(0, 1)}
                  </div>
                  <div className="flex flex-col text-sm ml-2">
                    <div className=" text-gray-900 font-semibold dark:bg-zinc-900 dark:text-gray-200">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-gray-500 text-xs dark:text-gray-400">{user?.email}</div>
                  </div>
                  <DropdownMenuCheckboxes
                    setIsUserProfileModalOpen={setIsUserProfileModalOpen}
                    isUserProfileModalOpen={isUserProfileModalOpen}
                  />
                </div>
              )}
            </div>
          </div>
          <main className="flex-1 p-6 dark:bg-zinc-900">{children}</main>
        </div>
      </div>
      {isUserProfileModalOpen && user && (
        <UserProfileModal
          handleSubmit={handleSubmit}
          setUserData={setUserData}
          userData={userData}
          isUserProfileMOdalOpen={isUserProfileModalOpen}
          setIsUserProfileModalOpen={setIsUserProfileModalOpen}
        />
      )}
    </SidebarProvider>
  );
};

export default Layout;
