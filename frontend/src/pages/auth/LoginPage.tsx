import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { type LoginValue } from "../../types/types";
import parishLogo from "../../assets/images/parish-logo.png";
import { EyeOff, Eye, Clock, Calendar } from "lucide-react";
import { useLoginUser } from "../../hooks/auth/useLoginUser";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    mutate: loginUser,
    isPending,
    error,
    isSuccess,
    data,
  } = useLoginUser();

  const [formValue, setFormValue] = useState<LoginValue>({
    email: "",
    password: "",
  });

  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isSuccess && data?.success) {
      toast.success("Login successfully.");
      navigate("/dashboard");
    } else if (error) {
      setErrorMessage(error.message);
    }
  }, [isSuccess, data, error, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    loginUser(formValue);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col md:gap-16 gap-10 items-center">
        <div className="mt-10 md:mt-12 lg:mt-18">
          <div className="flex items-center gap-2">
            <img src={parishLogo} className="md:h-20 h-16" alt="Parish Logo" />
            <div>
              <h1 className="text-center md:text-2xl text-lg text-gray-800 font-bold tracking-wider">
                St. Isidore The Laborer
              </h1>
              <h1 className="md:text-2xl text-lg text-gray-800 font-bold tracking-wider md:mt-1">
                Parish of Merida
              </h1>
            </div>
          </div>
        </div>
        <motion.form
          className="form-glass w-full sm:max-w-md xl:max-w-lg p-8 bg-white rounded-2xl md:border md:border-gray-300 border-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">
            Welcome back
          </h2>
          <h3 className="text-gray-600 text-center mb-4">
            Please enter your details to login.
          </h3>

          {/* Show error message */}
          {errorMessage && (
            <p className="text-red-400 text-center mb-4">{errorMessage}</p>
          )}

          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
              Email
            </label>
            <input
              type="text"
              value={formValue.email}
              onChange={(e) =>
                setFormValue({ ...formValue, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
              Password
            </label>
            <input
              type={isPasswordOpen ? "text" : "password"}
              value={formValue.password}
              onChange={(e) =>
                setFormValue({ ...formValue, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />
            {isPasswordOpen ? (
              <Eye
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(false)}
                size={16}
              />
            ) : (
              <EyeOff
                className="text-gray-800 absolute right-6 bottom-3 cursor-pointer"
                onClick={() => setIsPasswordOpen(true)}
                size={16}
              />
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-sm text-gray-700 cursor-pointer font-semibold"
            >
              Remember Me
            </label>
          </div>

          <div className="mt-6 flex justify-end w-full">
            <button
              type="submit"
              className="w-full px-6 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer rounded-lg focus:outline-none focus:ring focus:ring-blue-200 flex justify-center"
            >
              {isPending ? (
                <div className="w-6 h-6 border-4 border-gray-50 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          <div className="mt-4 flex justify-start w-full">
            <p className="text-sm">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-indigo-600">
                Sign up
              </a>
            </p>
          </div>
        </motion.form>
      </div>
      <div className="flex justify-center items-center flex-1 h-screen bg-blue-50 max-sm:hidden">
        <div>
          <div className="flex justify-center gap-4">
            <Calendar className="text-blue-400" size={80} />
            <Clock className="text-blue-400" size={80} />
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
