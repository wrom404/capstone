import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { type CreateUserProps } from "@/types/types";
import useCreateUser from "@/hooks/user/useCreateUser";
import toast from "react-hot-toast";

const Signup = () => {
  const { mutate: createUser, isPending, error, data } = useCreateUser();
  const [formValue, setFormValue] = useState<CreateUserProps>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);
  const [isConfirmPasswordError, setIsConfirmPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValue.password !== formValue.confirmPassword) {
      setIsConfirmPassword("Password did not match");
      return;
    }
    const newUser = { ...formValue }; // Directly use formValue
    delete newUser.confirmPassword; // Remove confirmPassword before sending
    createUser(newUser);
  };

  useEffect(() => {
    if (data) {
      toast.success("User created successfully");
      setFormValue({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [data]);

  if (error) {
    console.log(error);
  }
  return (
    <div className="h-full">
      <div className="h-full flex justify-center gap-2 items-center">
        <motion.form
          className="form-glass w-full sm:max-w-md xl:max-w-2xl p-8 bg-white rounded"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">
            Create User
          </h2>
          <div className="flex gap-4">
            <div className="mb-4 w-full">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                First Name
              </label>
              <input
                type="text"
                value={formValue.firstName}
                onChange={(e) =>
                  setFormValue({ ...formValue, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Last Name
              </label>
              <input
                type="text"
                value={formValue.lastName}
                onChange={(e) =>
                  setFormValue({ ...formValue, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="text"
              value={formValue.email}
              onChange={(e) =>
                setFormValue({ ...formValue, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type={isPasswordOpen ? "text" : "password"}
              value={formValue.password}
              onChange={(e) =>
                setFormValue({ ...formValue, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />
            {isPasswordOpen ? (
              <EyeOff
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(false)}
                size={16}
              />
            ) : (
              <Eye
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(true)}
                size={16}
              />
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type={isPasswordOpen ? "text" : "password"}
              value={formValue.confirmPassword}
              onChange={(e) =>
                setFormValue({ ...formValue, confirmPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />
            {isPasswordOpen ? (
              <EyeOff
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(false)}
                size={16}
              />
            ) : (
              <Eye
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(true)}
                size={16}
              />
            )}
          </div>
          {isConfirmPasswordError && (
            <p className="w-full text-center text-sm text-red-600">
              {isConfirmPasswordError}
            </p>
          )}
          <div className="my-6 flex justify-end w-full">
            <button
              type="submit"
              className="w-full px-6 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer rounded-lg focus:outline-none focus:ring focus:ring-blue-200 flex justify-center"
            >
              {/* {isPending ? (
                <div className="w-6 h-6 border-4 border-gray-50 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )} */}
              {isPending ? (
                <div className="w-6 h-6 border-4 border-gray-50 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Signup;
