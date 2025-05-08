import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function DropdownMenuCheckboxes({
  setIsUserProfileModalOpen,
  isUserProfileModalOpen,
}: {
  setIsUserProfileModalOpen: (isOpen: boolean) => void;
  isUserProfileModalOpen: boolean;
}) {
  // const { showStatusBar, setShowStatusBar } = useUserStore(); // Assuming you have a store to manage the status bar visibility
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  return (
    <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-white shadow-none border-none focus:ring-white focus:outline-white dark:bg-zinc-900 dark:hover:text-gray-50 dark:hover:bg-zinc-800 hover:bg-indigo-200  transition-transform ease-in-out rounded-2xl h-fit cursor-pointer"
          onClick={(e) => {
            e.currentTarget.blur(); // Removes focus after clicking
            setIsDropDownOpen((prev) => !prev); // Toggle dropdown open state
          }}
        >
          {isDropDownOpen ? (
            <ChevronUp className="text-gray-600" />
          ) : (
            <ChevronDown className="text-gray-600" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-6 dark:bg-zinc-900 dark:hover:text-gray-50">
        <DropdownMenuLabel>
          <span className="dark:text-gray-200">Options</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          // checked={showStatusBar}
          onClick={(e) => {
            e.stopPropagation(); // Prevents the dropdown from closing when clicking this item
            setIsUserProfileModalOpen(!isUserProfileModalOpen); // Toggle user profile modal open state
          }}
        >
          <UserRound className="text-indigo-600 dark:text-indigo-400" />{" "}
          <span className="dark:text-gray-300">Profile</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          <LogOut className="text-indigo-600 dark:text-indigo-400" />{" "}
          <Link className="dark:text-gray-300" to={"/logout"}>
            Logout
          </Link>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
