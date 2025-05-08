import { Textarea } from "@/src/components/ui/textarea";
import { TriangleAlert } from "lucide-react";

const CustomCancelModal = ({
  isModalOpen,
  onConfirm,
  onCancel,
  cancelMessage,
  handleOnChange,
}: {
  isModalOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cancelMessage: string;
  handleOnChange: (reason: string) => void;
}) => {
  if (!isModalOpen) {
    return;
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10 dark:bg-zinc-900/80">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[28rem] dark:bg-zinc-800 dark:text-gray-200">
        <div className="flex gap-2 mb-4">
          <TriangleAlert className="text-red-600 dark:text-red-500" />
          <h2 className="text-lg dark:text-gray-200">Cancel Event</h2>
        </div>
        <h2 className="mb-2 dark:text-gray-300">Reason</h2>
        <Textarea
          className="mb-4 dark:bg-zinc-900 dark:text-gray-200"
          placeholder="Reasons..."
          value={cancelMessage}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleOnChange(e.target.value)
          }
        />
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer dark:bg-zinc-900 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-zinc-800"  
            onClick={onCancel}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-base cursor-pointer dark:bg-red-700 dark:hover:bg-red-800"
            onClick={onConfirm}
          >
            Cancel Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomCancelModal;
