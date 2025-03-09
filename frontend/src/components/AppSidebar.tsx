import { Sidebar } from "@/components/ui/sidebar";
import { Link } from "react-router";
import { House, Calendar, Archive, CalendarPlus2, LogOut } from "lucide-react";
import { MdOutlineEventNote } from "react-icons/md";

export const AppSidebar: React.FC = () => {
  return (
    <Sidebar className="w-64 bg-gray-50 text-gray-700 h-screen p-4">
      <h2 className="text-lg font-bold px-2 text-gray-800">Dashboard</h2>
      <ul className="mt-4">
        <li className="py-2 px-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg flex items-center gap-2">
          <House size={20} />
          <Link to={"/"} className="font-semibold">
            Home
          </Link>
        </li>
        <li className="py-2 px-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg flex items-center gap-2">
          <Calendar size={20} />
          <Link to={"/calendar"} className="font-semibold">
            Calendar
          </Link>
        </li>
        <li className="py-2 px-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg flex items-center gap-2">
          <MdOutlineEventNote size={20} />{" "}
          <Link to={"/event"} className="font-semibold">
            Event
          </Link>
        </li>
        <li className="py-2 px-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg flex items-center gap-2">
          <Archive size={20} />
          <Link to={"/archive"} className="font-semibold">
            Archive
          </Link>
        </li>
        <li className="py-2 px-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg flex items-center gap-2">
          <CalendarPlus2 size={20} />
          <Link to={"/schedule"} className="font-semibold">
            Schedule
          </Link>
        </li>
        <li className="py-2 px-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900 rounded-lg flex items-center gap-2">
          <LogOut size={20} />
          <Link to={"/logout"} className="font-semibold">
            Logout
          </Link>
        </li>
      </ul>
    </Sidebar>
  );
};
