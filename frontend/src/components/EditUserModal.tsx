import { FetchedUserProps } from "@/types/types";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const EditUserModal = ({
  isModalOpen,
  setIsModalOpen,
  user,
  onUpdate,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  user: FetchedUserProps;
  onUpdate: (updatedUser: FetchedUserProps) => void;
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: user.password || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(formData);
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10 dark:bg-black/80">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 dark:bg-zinc-800 dark:text-gray-200 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300">Edit User</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-500 cursor-pointer dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              disabled
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              disabled
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email" // ✅ Corrected name
              value={formData.email}
              disabled
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 dark:text-gray-300">
              Role
            </label>
            <select
              name="role" // ✅ Corrected name
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700" 
            >
              <option value="Administrator">Administrator</option>
              <option value="Parish Office Personnel">
                Parish Office Personnel
              </option>
              <option value="Sacristan">Sacristan</option>
              <option value="Choir Member">Choir Member</option>
              <option value="Lay Minister">Lay Minister</option>
              <option value="Lector">Lector</option>
              <option value="Altar Server">Altar Server</option>
              <option value="Catechist">Catechist</option>
              <option value="Youth Ministry Member">
                Youth Ministry Member
              </option>
              <option value="Collector">Collector</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"  
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
