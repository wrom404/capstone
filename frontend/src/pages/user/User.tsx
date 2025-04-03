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

const User = () => {
  const [userId, setUserId] = useState<string>("");
  const {
    data,
    isPending: isFetchingUser,
    error: fetchError,
  } = useFetchUsers();
  const {
    mutate: deleteUser,
    isSuccess,
    isPending: isDeletingUser,
    error: deleteError,
  } = useDeleteUser(userId);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (fetchError) {
      console.log("error: ", fetchError);
    } else {
      console.log("error: ", deleteError);
    }
  }, [deleteError, fetchError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("User deleted successfully");
    }
  }, [isSuccess]);

  const handleClickDelete = (id: string) => {
    setUserId(id);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (userId) {
      setIsModalOpen(false);
      deleteUser(userId);
    }
  };

  const handleEdit = (id: string) => {
    console.log(id);
  };

  if (isFetchingUser || isDeletingUser) {
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
            {data &&
              data.length > 0 &&
              data.map((user, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={index}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {`${user.first_name} ${user.last_name}`}
                        </div>
                      </div>
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
                    {user.role !== "admin" ? (
                      <>
                        <button
                          onClick={() => handleEdit(user.id || "")}
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
                    ) : null}
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </motion.div>
      <CustomDeleteModal
        icon={TriangleAlert}
        isOpen={isModalOpen}
        title="Delete User"
        message="Proceed to delete? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default User;
