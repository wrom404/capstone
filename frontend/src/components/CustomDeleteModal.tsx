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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10 dark:bg-black/80">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[28rem] dark:bg-zinc-900 dark:text-gray-200 dark:border-zinc-700 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            className={`${
              (title && title == "Delete Event") || title == "Delete User"
                ? "text-red-600 dark:text-red-500"
                : "text-indigo-600 dark:text-indigo-500"
            }`}
          />
          <h2 className="text-lg font-">{title}</h2>
        </div>
        <p className="mb-4 text-base text-gray-700 dark:text-gray-300 dark:opacity-80">
          {message}
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 cursor-pointer rounded-md ${
              (title && title == "Delete Event") || title == "Delete User"
                ? "bg-red-600 text-white rounded hover:bg-red-700 text-base dark:bg-red-700 dark:hover:bg-red-800"
                : "bg-indigo-600 text-white rounded hover:bg-indigo-700 text-base dark:bg-indigo-700 dark:hover:bg-indigo-800"
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
