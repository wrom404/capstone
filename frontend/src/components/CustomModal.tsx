import { type ModalProps } from "@/types/types";
import { TriangleAlert } from "lucide-react";

const CustomModal = ({
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
        <div className="flex gap-2 mb-4">
          <TriangleAlert className="text-red-600" />
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
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-base"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
