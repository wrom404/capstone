import { Sidebar } from "@/components/ui/sidebar";
import { Link } from "react-router";
import {
  Calendar,
  Archive,
  CalendarPlus2,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { MdOutlineEventNote } from "react-icons/md";
import { useLocation } from "react-router";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect } from "react";

export const AppSidebar = () => {
  const { isPending, data: user, error } = useCurrentUser();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log(user.first_name);
    }
  }, [user]);

  if (error) {
    console.log(error);
  }

  if (isPending) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <Sidebar className="w-64 bg-(--background-color) text-gray-800 h-screen p-4">
      <h2 className="text-lg font-bold px-2 text-gray-800 bg-(--background-color)">Dashboard</h2>
      <ul className="mt-4 bg-(--background-color) h-full">
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/overview"
              ? "bg-white border border-[#21618c] text-[#21618c]"
              : ""
          } hover:bg-white hover:text-gray-950 rounded-lg flex items-center gap-2`}
        >
          <LayoutDashboard size={20} />
          <Link to={"/overview"} className="font-semibold">
            Overview
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/calendar"
              ? "bg-white border border-[#21618c] text-[#21618c]"
              : ""
          } hover:bg-white hover:text-gray-950 rounded-lg flex items-center gap-2`}
        >
          <Calendar size={20} />
          <Link to={"/calendar"} className="font-semibold">
            Calendar
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/event"
              ? "bg-white border border-[#21618c]  text-[#21618c]"
              : ""
          } hover:bg-white hover:text-gray-950 rounded-lg flex items-center gap-2`}
        >
          <MdOutlineEventNote size={20} />{" "}
          <Link to={"/event"} className="font-semibold">
            Event
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/archive"
              ? "bg-white border border-[#21618c] text-[#21618c]"
              : ""
          } hover:bg-white hover:text-gray-950 rounded-lg flex items-center gap-2`}
        >
          <Archive size={20} />
          <Link to={"/archive"} className="font-semibold">
            Archive
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/schedule"
              ? "bg-white border border-[#21618c] text-[#21618c]"
              : ""
          } hover:bg-white hover:text-gray-950 rounded-lg flex items-center gap-2`}
        >
          <CalendarPlus2 size={20} />
          <Link to={"/schedule"} className="font-semibold">
            Schedule
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer hover:bg-white hover:border hover:border-[#21618c] hover:text-gray-950 rounded-lg flex items-center gap-2`}
        >
          <LogOut size={20} />
          <Link to={"/logout"} className="font-semibold">
            Logout
          </Link>
        </li>
      </ul>
      <div className="flex items-center bg-(--background-color)">
        <div className="bg-white w-fit py-2 px-4 rounded-full text-2xl font-bold border border-[#21618c] text-[#21618c]">
          {user?.first_name.slice(0, 1)}
        </div>
        <div className="flex flex-col text-sm ml-2">
          <div className="font-semibold text-gray-700">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="text-gray-600">{user?.email}</div>
        </div>
      </div>
    </Sidebar>
  );
};
