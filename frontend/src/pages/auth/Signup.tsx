import { motion } from "framer-motion";
import { Calendar, Clock, Eye, EyeOff } from "lucide-react";
import {
  Select as CustomSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useState, useEffect } from "react";
import parishLogo from "../../assets/images/parish-logo.png";
import useCreateUser from "../../hooks/user/useCreateUser";
import toast from "react-hot-toast";
import { CreateUserProps } from "@/types/types";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { mutate: createUser, isPending, error, data } = useCreateUser();
  const [formValue, setFormValue] = useState<CreateUserProps>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);
  const [isConfirmPasswordError, setIsConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  // Use isConfirmPasswordError to display an error message
  const renderErrorMessage = () => {
    if (isConfirmPasswordError) {
      return (
        <p className="text-red-400 text-center mb-4">
          {isConfirmPasswordError}
        </p>
      );
    }
    return null;
  };

  useEffect(() => {
    if (data) {
      setFormValue({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      toast.success("Sign up successfully, redirecting to sign in page...", {
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    }
  }, [data, navigate]);

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

  if (error) {
    console.log(error);
  }

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row overflow-auto">
      <div className="flex-1 flex flex-col md:gap-16 gap-10 mb-8 items-center h-full">
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="form-glass w-full sm:max-w-md xl:max-w-lg p-8 bg-white rounded-2xl md:border md:border-gray-300 border-0"
        >
          {renderErrorMessage()}
          <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">
            Sign up
          </h2>
          <h3 className="text-gray-600 text-center mb-4">
            Please fill in this form to create an account.
          </h3>

          {/* Show error message */}
          {/* {errorMessage && (
            <p className="text-red-400 text-center mb-4">{errorMessage}</p>
          )} */}
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
              First Name
            </label>
            <input
              type="text"
              value={formValue.firstName}
              onChange={(e) =>
                setFormValue({ ...formValue, firstName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
              Last Name
            </label>
            <input
              type="text"
              value={formValue.lastName}
              onChange={(e) =>
                setFormValue({ ...formValue, lastName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-transparent text-gray-900"
            />
          </div>
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
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
              Position in the Church
            </label>
            <CustomSelect
              value={formValue.role}
              onValueChange={(value) =>
                setFormValue({ ...formValue, role: value })
              }
            >
              <SelectTrigger className="w-full border border-gray-300 shadow-none">
                <SelectValue placeholder="Select your position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Parish Office Personnel">
                  Parish Office Personnel
                </SelectItem>
                <SelectItem value="Sacristan">Sacristan</SelectItem>
                <SelectItem value="Choir Member">Choir Member</SelectItem>
                <SelectItem value="Lay Minister">Lay Minister</SelectItem>
                <SelectItem value="Lector">Lector</SelectItem>
                <SelectItem value="Altar Server">Altar Server</SelectItem>
                <SelectItem value="Catechist">Catechist</SelectItem>
                <SelectItem value="Youth Ministry Member">
                  Youth Ministry Member
                </SelectItem>
                <SelectItem value="Collector">Collector</SelectItem>
              </SelectContent>
            </CustomSelect>
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
          <div className="mb-4 relative">
            <label className="block mb-1 text-sm text-gray-900 font-semibold">
              Confirm Password
            </label>
            <input
              type={isPasswordOpen ? "text" : "password"}
              value={formValue.confirmPassword}
              onChange={(e) =>
                setFormValue({ ...formValue, confirmPassword: e.target.value })
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
          <div className="mt-6 flex justify-end w-full">
            <button
              type="submit"
              className="w-full px-6 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer rounded-lg focus:outline-none focus:ring focus:ring-blue-200 flex justify-center"
            >
              {isPending ? (
                <div className="w-6 h-6 border-4 border-gray-50 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
          <div className="mt-4 flex justify-start w-full">
            <p className="text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="text-indigo-600">
                Sign in
              </a>
            </p>
          </div>
        </motion.form>
      </div>
      <div className="hidden md:flex w-1/2 bg-blue-100 flex-col justify-center items-center p-4">
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

export default Register;
