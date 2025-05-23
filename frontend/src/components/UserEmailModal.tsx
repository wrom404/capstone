import { useState, useEffect } from "react";
import { X, Check, User, Search } from "lucide-react";
import { type FetchUserProps, type SelectedUserEmail } from "@/types/types";

const UserModal = ({
  selectedUsers,
  setSelectedUsers,
  users,
  isModalOpen,
  setIsModalOpen,
}: {
  selectedUsers: SelectedUserEmail[];
  setSelectedUsers: (selectedUsers: SelectedUserEmail[]) => void;
  users: FetchUserProps[];
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<FetchUserProps[]>(users);
  const [roles, setRoles] = useState<string[]>([]);

  // Extract unique roles from users
  useEffect(() => {
    if (users && users.length > 0) {
      const uniqueRoles = [...new Set(users.map((user) => user.role))].filter(
        Boolean
      ) as string[];
      setRoles(uniqueRoles);
    }
  }, [users]);

  // Filter users based on search term
  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          "" ||
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          "" ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          "" ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ""
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  // Function to toggle individual user selection
  const toggleUser = (user: FetchUserProps) => {
    const index = selectedUsers.findIndex((u) => u.email === user.email);
    if (index === -1) {
      setSelectedUsers([...selectedUsers, { email: user.email as string }]);
    } else {
      setSelectedUsers([
        ...selectedUsers.slice(0, index),
        ...selectedUsers.slice(index + 1),
      ]);
    }
  };

  // Check if a user is currently selected
  const isUserSelected = (email: string | undefined): boolean => {
    if (!email) return false;
    return selectedUsers.some((user) => user.email === email);
  };

  // Function to select all users with a specific role
  const selectUsersByRole = (role: string) => {
    const usersWithRole = users.filter((user) => user.role === role);
    const emailsToAdd = usersWithRole
      .map((user) => user.email as string)
      .filter((email) => !selectedUsers.some((u) => u.email === email));

    if (emailsToAdd.length > 0) {
      const newSelectedUsers = [
        ...selectedUsers,
        ...emailsToAdd.map((email) => ({ email })),
      ];
      setSelectedUsers(newSelectedUsers);
    }
  };

  // Function to select all users
  const selectAllUsers = () => {
    const allEmails = users.map((user) => ({ email: user.email as string }));
    setSelectedUsers(allEmails);
  };

  // Function to clear all selections
  const clearSelections = () => {
    setSelectedUsers([]);
  };

  // Role color mapping for more visual distinction
  const roleColors: Record<string, string> = {
    "Head Administrator":
      "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200", // naa
    Administrator:
      "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200", // naa
    "Choir Member":
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200", //naa
    "Youth Ministry Member":
      "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200", // naa
    "Parish Office Personnel":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200", // naa
    Sacristan: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200", // naa
    "Lay Minister":
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", // naa
    Lector: "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-200", //. naa
    "Altar Server":
      "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200", // naa
    catechist:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200",
    Collector: "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200",
  };

  // Get initials from name
  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0).toUpperCase() || "";
    const last = lastName?.charAt(0).toUpperCase() || "";
    return first + (last ? last : "");
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex justify-center items-center p-4 z-10 dark:bg-black/80">
      <div className="bg-white rounded-xl shadow-xl w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto overflow-hidden dark:bg-zinc-800 dark:text-gray-200">
        {/* Modal Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center dark:text-gray-200">
            <User
              size={20}
              className="mr-2 text-indigo-600 dark:text-indigo-400"
            />
            Select Users
          </h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={closeModal}
          >
            <X size={18} className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
            />
            <input
              type="text"
              placeholder="Search users by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800 dark:text-gray-200 dark:border-gray-600 dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Role Selection Pills */}
        <div className="px-6 pt-2 pb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => selectUsersByRole(role)}
                className={`${
                  roleColors[role] ||
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                } text-xs font-medium py-1.5 px-3 rounded-full transition-all hover:opacity-80 cursor-pointer`}
              >
                {role}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
              selected
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAllUsers}
                type="button"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Select All
              </button>
              <span className="text-gray-300 dark:text-gray-400">|</span>
              <button
                onClick={clearSelections}
                type="button"
                className="text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="max-h-80 overflow-y-auto border-t border-b">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No users found matching your search.
            </div>
          ) : (
            filteredUsers.map((user, index) => {
              const isSelected = isUserSelected(user.email as string);
              return (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 cursor-pointer dark:hover:bg-zinc-700"
                  onClick={() => toggleUser(user)}
                >
                  {/* Checkbox (left side) */}
                  <div
                    className={`w-5 h-5 rounded-md mr-4 flex items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500"
                        : "border-2 border-gray-300 hover:border-indigo-500 dark:border-gray-600 dark:hover:border-indigo-400"
                    } transition-all`}
                  >
                    {isSelected && <Check size={14} color="white" />}
                  </div>

                  {/* User Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full ${
                      isSelected
                        ? "bg-indigo-600 dark:bg-indigo-500"
                        : "bg-gray-200"
                    } text-white flex items-center justify-center mr-3 flex-shrink-0 transition-colors dark:bg-gray-700`}
                  >
                    {getInitials(
                      user.first_name as string,
                      user.last_name as string
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-gray-800 truncate dark:text-gray-200">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  {user.role && (
                    <div
                      className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        roleColors[user.role] ||
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {user.role}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-700 border-t">
          <button
            className="text-base px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-zinc-600 dark:hover:text-gray-200 cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="text-base px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700 cursor-pointer"
            onClick={closeModal}
          >
            Confirm Selection ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
