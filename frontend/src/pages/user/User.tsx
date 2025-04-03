import {
  Trash2,
  Shield,
  User as UserIcon,
  Pencil,
  TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import useFetchUsers from "@/hooks/user/useFetchUsers";
import CustomDeleteModal from "@/components/CustomDeleteModal";
import { useEffect, useState } from "react";
import useDeleteUser from "@/hooks/user/useDeleteUser";
import toast from "react-hot-toast";
import useFetchUser from "@/hooks/user/useFetchUser";
import EditUserModal from "@/components/EditUserModal";
import { FetchedUserProps } from "@/types/types";

const User = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: users,
    isPending: isFetchingUsers,
    error: fetchError,
  } = useFetchUsers();

  const {
    mutate: deleteUser,
    isSuccess,
    isPending: isDeletingUser,
    error: deleteError,
  } = useDeleteUser(selectedUserId || "");

  const {
    data: selectedUser,
    isPending: isFetchingUser,
    error: fetchUserError,
  } = useFetchUser(selectedUserId || "", {
    enabled: !!selectedUserId, // Only fetch user if selectedUserId exists
  });

  useEffect(() => {
    if (fetchError) console.log("Fetch Error:", fetchError);
    if (deleteError) console.log("Delete Error:", deleteError);
    if (fetchUserError) console.log("Fetch User Error:", fetchUserError);
  }, [deleteError, fetchError, fetchUserError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("User deleted successfully");
      setIsDeleteModalOpen(false);
    }
  }, [isSuccess]);

  const handleClickDelete = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedUserId) {
      deleteUser(selectedUserId);
    }
  };

  const handleClickEdit = (id: string) => {
    setSelectedUserId(id);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = (updatedUser: FetchedUserProps) => {
    console.log("updatedUser: ", updatedUser);
  };

  if (isFetchingUsers || isDeletingUser || (isFetchingUser && selectedUserId)) {
    return (
      <div className="min-h-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl text-gray-800 font-bold">User Management</h2>
        <p className="text-sm text-gray-700">
          Easily view and manage users, including their name, email, and role.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border rounded-lg overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users &&
              users.map((user, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={user.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {`${user.first_name} ${user.last_name}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.role === "admin" ? (
                        <Shield className="w-4 h-4 text-purple-500 mr-1" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-blue-500 mr-1" />
                      )}
                      <span
                        className={`text-sm ${
                          user.role === "admin"
                            ? "text-purple-700"
                            : "text-blue-700"
                        }`}
                      >
                        {user.role &&
                          user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role !== "admin" && (
                      <>
                        <button
                          onClick={() => handleClickEdit(user.id || "")}
                          className="text-green-600 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleClickDelete(user.id || "")}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 cursor-pointer ml-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </motion.div>

      {/* Edit User Modal */}
      <EditUserModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        user={
          selectedUser || {
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
            role: "",
          }
        }
        onUpdate={handleUpdateUser}
      />

      {/* Delete Confirmation Modal */}
      <CustomDeleteModal
        icon={TriangleAlert}
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message="Proceed to delete? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default User;
