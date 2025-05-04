import { Sidebar } from "@/components/ui/sidebar";
import { Link } from "react-router";
import {
  Calendar,
  Archive,
  CalendarPlus2,
  LogOut,
  LayoutDashboard,
  Users,
  Church,
} from "lucide-react";
import { MdOutlineEventNote } from "react-icons/md";
import { useLocation } from "react-router";
import useUserStore from "@/store/useUserStore";
import { roles as adminRoles } from "@/constant/constant";

export const AppSidebar = () => {
  const { userRole } = useUserStore();
  const location = useLocation();

  return (
    <Sidebar className="w-64 bg-white text-gray-800 h-screen p-4">
      <h2 className="text-lg font-bold px-2 text-gray-800 bg-white flex gap-2.5">
        <div className=" border p-0.5 rounded-md">
          <Church className="w-6 h-6 text-indigo-600" />
        </div>
        <span className="text-xl font-bold text-gray-800">Parish Events</span>
      </h2>
      <ul className="pt-4 bg-white h-full">
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/dashboard"
              ? "bg-indigo-50 text-indigo-600 rounded-lg"
              : "hover:bg-gray-50 text-gray-700"
          }  rounded-lg flex items-center gap-2`}
        >
          <LayoutDashboard size={20} />
          <Link to={"/dashboard"} className="font-semibold">
            Dashboard
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/calendar"
              ? "bg-indigo-50 text-indigo-600 rounded-lg"
              : "hover:bg-gray-50 text-gray-700"
          }  rounded-lg flex items-center gap-2`}
        >
          <Calendar size={20} />
          <Link to={"/calendar"} className="font-semibold">
            Calendar
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/event"
              ? "bg-indigo-50 text-indigo-600 rounded-lg"
              : "hover:bg-gray-50 text-gray-700"
          }  rounded-lg flex items-center gap-2`}
        >
          <MdOutlineEventNote size={20} />{" "}
          <Link to={"/event"} className="font-semibold">
            Event
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/archive"
              ? "bg-indigo-50 text-indigo-600 rounded-lg"
              : "hover:bg-gray-50 text-gray-700"
          }  rounded-lg flex items-center gap-2`}
        >
          <Archive size={20} />
          <Link to={"/archive"} className="font-semibold">
            Archive
          </Link>
        </li>
        {userRole && adminRoles.includes(userRole) && (
          <>
            <li
              className={`py-2 px-2 cursor-pointer ${
                location.pathname === "/schedule"
                  ? "bg-indigo-50 text-indigo-600 rounded-lg"
                  : "hover:bg-gray-50 text-gray-700"
              }  rounded-lg flex items-center gap-2`}
            >
              <CalendarPlus2 size={20} />
              <Link to={"/schedule"} className="font-semibold">
                Schedule
              </Link>
            </li>
          </>
        )}
        {userRole && ["Head Administrator"].includes(userRole) && (
          <li
            className={`py-2 px-2 cursor-pointer ${
              location.pathname === "/users"
                ? "bg-indigo-50 text-indigo-600 rounded-lg"
                : "hover:bg-gray-50 text-gray-700"
            }  rounded-lg flex items-center gap-2`}
          >
            <Users size={20} />
            <Link to={"/users"} className="font-semibold">
              Users
            </Link>
          </li>
        )}
        <li
          className={`py-2 px-2 cursor-pointer ${
            location.pathname === "/logout"
              ? "bg-indigo-50 text-indigo-600 rounded-lg"
              : "hover:bg-gray-50 text-gray-700"
          }  rounded-lg flex items-center gap-2`}
        >
          <LogOut size={20} />
          <Link to={"/logout"} className="font-semibold">
            Logout
          </Link>
        </li>
      </ul>
      <div></div>
    </Sidebar>
  );
};
