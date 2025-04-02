import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import useCurrentUser from "@/hooks/user/useCurrentUser";

// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { DropdownMenuCheckboxes } from "./DropDownComponent"; // Import the props type
import { useEffect } from "react";
import useUserStore from "@/store/useUserStore";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isPending, data: user, error } = useCurrentUser();
  const { setUserRole } = useUserStore();

  useEffect(() => {
    if (user?.role) {
      setUserRole(user?.role);
    }
  }, [user, setUserRole]);

  if (error) {
    console.log(error);
  }
  return (
    <SidebarProvider className="w-full">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}

        <div className="flex-1 flex flex-col w-full">
          <div className="border-b border-gray-300 py-2 flex justify-between w-full  text-gray-800">
            <SidebarTrigger className="p-4 hover:bg-indigo-200" />
            <div className="">
              {isPending ? (
                ""
              ) : (
                <div className="flex items-center-500 mr-6 my-0.5">
                  <div className="bg-indigo-600 h-10 w-10 rounded-full text-xl font-bold border text-white flex items-center justify-center">
                    {user?.first_name?.slice(0, 1)}
                  </div>
                  <div className="flex flex-col text-sm ml-2">
                    <div className=" text-gray-900 font-semibold">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-gray-500 text-xs">{user?.email}</div>
                  </div>
                  <DropdownMenuCheckboxes />
                </div>
              )}
            </div>
          </div>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
