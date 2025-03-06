import { motion } from "framer-motion";
import { useState } from "react";
import { type LoginValue } from "../types/types";
import parishLogo from "../assets/images/parish-logo.png";
import { EyeOff, Eye, Clock, Calendar } from "lucide-react";
import { useLoginUser } from "../hooks/useLoginUser";

const LoginPage = () => {
  const { mutate, error, isPending } = useLoginUser();
  const [formValue, setFormValue] = useState<LoginValue>({
    email: "",
    password: "",
  });
  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formValue);
  };

  if (error) {
    return (
      <div className="min-h-screen h-screen flex justify-center items-center">
        <span className="text-red-600 text-lg">Something went wrong</span>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen border border-red-300 flex">
      <div
        onSubmit={() => handleSubmit}
        className="flex-1 flex flex-col gap-2 items-center"
      >
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
              type={isPasswordOpen ? "password" : "text"}
              value={formValue.password}
              onChange={(e) =>
                setFormValue({ ...formValue, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />

            {isPasswordOpen ? (
              <Eye
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                size={16}
              />
            ) : (
              <EyeOff
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                size={16}
              />
            )}
          </div>
          <div className="my-6 flex justify-end w-full">
            <button
              type="submit"
              className="btn-login border w-fit px-6 py-2 font-semibold text-gray-800 bg-primary rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              {isPending ? <span className="loader"></span> : "Login"}
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
