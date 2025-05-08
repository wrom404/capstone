import { X, UserRound } from "lucide-react";
import { UserProps } from "@/types/types";
import { ChangeEvent } from "react";

const UserProfileModal = ({
  handleSubmit,
  setUserData,
  userData,
  isUserProfileMOdalOpen,
  setIsUserProfileModalOpen,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setUserData: (user: UserProps) => void;
  userData: UserProps | null;
  isUserProfileMOdalOpen: boolean;
  setIsUserProfileModalOpen: (isOpen: boolean) => void;
}) => {
  if (!isUserProfileMOdalOpen) return null;
  const closeModal = () => {
    setIsUserProfileModalOpen(false);
  };

  console.log("User data in UserProfileModal: ", userData);
  return (
    <div className="fixed bg-black/50 inset-0 flex justify-center items-center z-20">
      <div className="bg-white p-8 min-h-2/4 min-w-2/6 rounded-lg shadow-lg flex flex-col">
        <div className=" pb-4 border-b border-gray-300 flex justify-between items-center">
          <span className="text-lg font-bold flex justify-center items-center">
            <UserRound className="inline mr-1" /> User Profile
          </span>{" "}
          <span className="">
            <X
              size={20}
              className="text-gray-500 cursor-pointer"
              onClick={closeModal}
            />
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col ">
            <label className="text-gray-600 text-sm" htmlFor="">
              First Name
            </label>
            <input
              type="text"
              value={userData?.first_name}
              disabled={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUserData({ ...userData, first_name: e.target.value })
              }
              className="border border-gray-400 rounded-lg py-2 px-3"
            />
          </div>
          <div className="flex flex-col ">
            <label className="text-gray-600 text-sm" htmlFor="">
              Last Name
            </label>
            <input
              type="text"
              value={userData?.last_name}
              disabled={true}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUserData({ ...userData, last_name: e.target.value })
              }
              className="border border-gray-400 rounded-lg py-2 px-3"
            />
          </div>
          <div className="flex flex-col mb-8">
            <label className="text-gray-600 text-sm" htmlFor="">
              Email
            </label>
            <input
              type="text"
              value={userData?.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUserData({ ...userData, email: e.target.value })
              }
              disabled={true}
              className="border border-gray-400 rounded-lg py-2 px-3"
            />
          </div>
          <div className="flex flex-col">
            <button className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 ease-in-out cursor-pointer">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
