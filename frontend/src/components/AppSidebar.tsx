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
  MapPin
} from "lucide-react";
import { MdOutlineEventNote } from "react-icons/md";
import { useLocation } from "react-router";
import useUserStore from "@/store/useUserStore";
import { roles as adminRoles } from "@/constant/constant";
import { useTheme } from "@/hooks/theme/useTheme";

export const AppSidebar = () => {
  const { userRole } = useUserStore();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <Sidebar className="dark:bg-zinc-900 w-64 bg-white text-gray-800 min-h-screen p-4">
      <h2 className="dark:bg-zinc-900 dark:text-gray-400 text-lg font-bold px-2 bg-white flex gap-2.5">
        <div className=" border p-0.5 rounded-md">
          <Church className="dark:text-indigo-400 w-6 h-6 text-indigo-600" />
        </div>
        <span className="dark:bg-zinc-900 dark:text-gray-300 text-xl font-bold text-gray-800">
          Parish Events
        </span>
      </h2>
      <ul className="dark:bg-zinc-900 dark:text-gray-400 pt-4 bg-white h-full space-y-2 overflow-hidden">
        <li
          className={`py-2 px-2 cursor-pointer ${location.pathname === "/dashboard"
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            : "dark:hover:bg-zinc-800"
            } rounded-lg flex items-center gap-2 hover:bg-gray-50`}
        >
          <LayoutDashboard size={20} />
          <Link to={"/dashboard"} className="font-semibold">
            Dashboard
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${location.pathname === "/calendar"
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            : "dark:hover:bg-zinc-800"
            }  rounded-lg flex items-center gap-2 hover:bg-gray-50`}
        >
          <Calendar size={20} />
          <Link to={"/calendar"} className="font-semibold">
            Calendar
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${location.pathname === "/event"
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            : "dark:hover:bg-zinc-800"
            }  rounded-lg flex items-center gap-2 hover:bg-gray-50`}
        >
          <MdOutlineEventNote size={20} />{" "}
          <Link to={"/event"} className="font-semibold">
            Event
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${location.pathname === "/archive"
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            : "dark:hover:bg-zinc-800"
            }  rounded-lg flex items-center gap-2 hover:bg-gray-50`}
        >
          <Archive size={20} />
          <Link to={"/archive"} className="font-semibold">
            Archive
          </Link>
        </li>
        {userRole && adminRoles.includes(userRole) && (
          <>
            <li
              className={`py-2 px-2 cursor-pointer ${location.pathname === "/schedule"
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                : "dark:hover:bg-zinc-800"
                }  rounded-lg flex items-center gap-2 hover:bg-gray-50`}
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
            className={`py-2 px-2 cursor-pointer ${location.pathname === "/users"
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
              : "dark:hover:bg-zinc-800"
              }  rounded-lg flex items-center gap-2 hover:bg-gray-50`}
          >
            <Users size={20} />
            <Link to={"/users"} className="font-semibold">
              Users
            </Link>
          </li>
        )}
        <li
          className={`py-2 px-2 cursor-pointer ${location.pathname.includes("/maps")
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            : "dark:hover:bg-zinc-800"
            }  rounded-lg flex items-center gap-2 hover:bg-gray-50`}
        >
          <MapPin size={20} />
          <Link to={"/maps/Merida Leyte"} className="font-semibold">
            Location
          </Link>
        </li>
        <li
          className={`py-2 px-2 cursor-pointer ${location.pathname === "/logout"
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
            : "dark:hover:bg-zinc-800"
            }  rounded-lg flex items-center gap-2 hover:bg-gray-50`}
        >
          <LogOut size={20} />
          <Link to={"/logout"} className="font-semibold">
            Logout
          </Link>
        </li>
      </ul>
      <div className="bg-white dark:bg-zinc-900 dark:text-gray-400 text-gray-600 p-2 rounded-lg flex flex-col items-start">
        <button
          onClick={toggleTheme}
          className="cursor-pointer p-2 text-base rounded-lg w-full text-start bg-gray-50 dark:bg-zinc-800 dark:text-gray-400 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 mt-4 font-semibold"
        >
          {theme === "light" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </Sidebar>
  );
};
