import { useRef } from "react";
import { X } from "lucide-react";
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
  const ref = useRef<HTMLDivElement>(null);
  const closeModal = () => {
    if (ref.current) {
      ref.current.style.display = "none";
    }
    setIsModalOpen(false);
  };
  if (!isModalOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10">
      <div
        ref={ref}
        className="h-full max-h-[80%] w-full sm:w-4/5 md:w-3/5 lg:w-2/5 bg-white rounded-xl py-4 px-6 overflow-y-auto"
      >
        <div className="flex justify-between border-b border-gray-300 pb-4 mx-3">
          <h3 className="text-gray-800 text-lg font-bold">Select Users</h3>
          <span className="cursor-pointer text-gray-500">
            <X size={20} onClick={closeModal} />
          </span>
        </div>
        <div className="mt-4 mx-4">
          <table className="w-full">
            <tbody>
              {users &&
                users.length > 0 &&
                users.map((user, index) => (
                  <tr key={index} className="mx-8">
                    <td className="text-left text-gray-600 py-3 border-b border-gray-300 mx-6">
                      <div className="flex space-x-2">
                        <div className="flex justify-center items-center">
                          <div className="text-base bg-indigo-600 text-white rounded-full w-9 h-9 flex items-center justify-center">
                            {user.first_name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex flex-col space-x-0">
                          <span className="text-gray-800 font-semibold">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-left text-gray-600 border-b border-gray-300">
                      <span className=" text-sm">{user.role}</span>
                    </td>
                    <td className="text-right text-gray-600 border-b border-gray-300">
                      <input
                        onChange={() => toggleUser(user)}
                        className="w-4 h-4 cursor-pointer"
                        type="checkbox"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
