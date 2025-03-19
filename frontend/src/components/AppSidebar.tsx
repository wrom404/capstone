import { Sidebar } from "@/components/ui/sidebar";
import { Link } from "react-router";
import {
  Calendar,
  Archive,
  CalendarPlus2,
  LogOut,
  LayoutDashboard,
  Church,
} from "lucide-react";
import { MdOutlineEventNote } from "react-icons/md";
import { useLocation } from "react-router";

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar className="w-64 bg-white text-gray-800 h-screen p-4">
      <h2 className="text-lg font-bold px-2 text-gray-800 bg-white flex gap-2.5">
        <Church className="w-6 h-6 text-indigo-600" />
        <span className="text-xl font-bold text-gray-800">Parish Events</span>
      </h2>
      <ul className="pt-4 bg-white h-full">
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/overview"
              ? "bg-white border border-indigo-600 text-indigo-600"
              : ""
          } hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2`}
        >
          <LayoutDashboard size={20} />
          <Link to={"/overview"} className="font-semibold">
            Overview
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/calendar"
              ? "bg-white border border-indigo-600 text-indigo-600"
              : ""
          } hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2`}
        >
          <Calendar size={20} />
          <Link to={"/calendar"} className="font-semibold">
            Calendar
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/event"
              ? "bg-white border border-indigo-600  textindigo-600]"
              : ""
          } hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2`}
        >
          <MdOutlineEventNote size={20} />{" "}
          <Link to={"/event"} className="font-semibold">
            Event
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/archive"
              ? "bg-white border border-indigo-600 text-indigo-600"
              : ""
          } hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2`}
        >
          <Archive size={20} />
          <Link to={"/archive"} className="font-semibold">
            Archive
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/schedule"
              ? "bg-white border border-indigo-600 text-indigo-600"
              : ""
          } hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2`}
        >
          <CalendarPlus2 size={20} />
          <Link to={"/schedule"} className="font-semibold">
            Schedule
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/logout"
              ? "bg-white border border-indigo-600 text-indigo-600"
              : ""
          } hover:bg-indigo-50 hover:text-indigo-600 rounded-lg flex items-center gap-2`}
        >
          <LogOut size={20} />
          <Link to={"/logout"} className="font-semibold">
            Logout
          </Link>
        </li>
      </ul>
      <div>
      </div>
    </Sidebar>
  );
};
