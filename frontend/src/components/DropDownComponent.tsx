import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, LogOut, UserRound, UserRoundPlus  } from "lucide-react";
import { useState } from "react";


export function DropdownMenuCheckboxes({
  showStatusBar,
  setShowStatusBar,
  showActivityBar,
  setShowActivityBar,
  showPanel,
  setShowPanel,
}: {
  showStatusBar: boolean; // Changed to boolean (no undefined)
  setShowStatusBar: (isChecked: boolean) => void;
  showActivityBar: boolean; // Changed to boolean (no undefined)
  setShowActivityBar: (isChecked: boolean) => void;
  showPanel: boolean; // Changed to boolean (no undefined)
  setShowPanel: (isChecked: boolean) => void;
}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  console.log("showStatusBar: ", showStatusBar);
  console.log("showActivityBar: ", showActivityBar);
  console.log("showPanel: ", showPanel);

  return (
    <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-white shadow-none border-none focus:ring-white focus:outline-white hover:bg-indigo-200 transition-transform ease-in-out rounded-2xl h-fit"
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
      <DropdownMenuContent className="w-56 mr-6">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          // checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          <UserRound className="text-indigo-600"/> Profile
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          // disabled
        >
          <UserRoundPlus className="text-indigo-600"/> Create User
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
        >
          <LogOut className="text-indigo-600"/> Logout
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
