import { type ModalProps } from "@/types/types";

const CustomDeleteModal = ({
  icon: Icon,
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ModalProps) => {
  if (!isOpen) {
    return;
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[28rem]">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            className={`${
              title && title == "Delete Event" || title == "Delete User"
                ? "text-red-600"
                : "text-indigo-600"
            }`}
          />
          <h2 className="text-lg font-">{title}</h2>
        </div>
        <p className="mb-4 text-base text-gray-700">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 ${
              (title && title == "Delete Event") || title == "Delete User"
                ? "bg-red-600 text-white rounded hover:bg-red-700 text-base"
                : "bg-indigo-600 text-white rounded hover:bg-indigo-700 text-base"
            }`}
            onClick={onConfirm}
          >
            {`${
              (title && title == "Delete Event") || title == "Delete User"
                ? "Delete"
                : "Restore"
            }`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDeleteModal;
