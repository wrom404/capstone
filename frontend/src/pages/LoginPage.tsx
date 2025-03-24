import { motion } from "framer-motion";
import { useState } from "react";
import { type LoginValue } from "../types/types";
import parishLogo from "../assets/images/parish-logo.png";
import { EyeOff, Eye, Clock, Calendar } from "lucide-react";
import { useLoginUser } from "../hooks/useLoginUser";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const mutation = useLoginUser();
  const [formValue, setFormValue] = useState<LoginValue>({
    email: "",
    password: "",
  });
  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formValue);
  };

  if (mutation.error) {
    return (
      <div className="min-h-screen h-screen flex justify-center items-center">
        <span className="text-red-600 text-lg">Something went wrong</span>
      </div>
    );
  }

  if (mutation.isSuccess) {
    navigate("/dashboard");
  }

  return (
    <div className="bg-white min-h-screen border border-red-300 flex">
      <div className="flex-1 flex flex-col gap-2 items-center">
        <div className="mt-18">
          <div className="flex items-center gap-2">
            <img src={parishLogo} className="h-20" alt="img" />
            <div className="">
              <h1 className="text-center text-2xl text-gray-800 font-bold tracking-wider">
                St. Isidore The Laborer
              </h1>
              <h1 className="text-2xl text-gray-800 font-bold tracking-wider mt-1">
                Parish of Merida
              </h1>
            </div>
          </div>
          <h2 className="text-center text-xl text-gray-600 mt-4 mb-8">
            Event Scheduling
          </h2>
        </div>
        <motion.form
          className="form-glass w-full sm:max-w-md xl:max-w-lg p-8 bg-white rounded sm:shadow-md "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">
            Login
          </h2>
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
          <div className="my-6 flex justify-end w-full">
            <button
              type="submit"
              className="w-fit px-6 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              {mutation.isPending ? (
                <div className="w-3 h-3 border-4 border-gray-50 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </motion.form>
      </div>
      <div className="flex justify-center items-center flex-1 h-screen bg-blue-50">
        <div className="">
          <div className="flex justify-center gap-4">
            <Calendar className="text-blue-600" size={80} />
            <Clock className="text-blue-600" size={80} />
          </div>
          <div className="mt-8">
            <h3 className="text-gray-800 text-2xl font-semibold tracking-wider text-center mb-6">
              Schedule Your Parish Events
            </h3>
            <p className="text-gray-700 max-w-96 text-center">
              Efficiently manage and schedule your parish activities, masses,
              and special events all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
