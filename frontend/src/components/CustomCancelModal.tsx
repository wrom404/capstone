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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[28rem]">
        <div className="flex gap-2 mb-4">
          <TriangleAlert className="text-red-600" />
          <h2 className="text-lg font-">Cancel Event</h2>
        </div>
        <h2 className="mb-2">Reason</h2>
        <Textarea
          className="mb-4"
          placeholder="Reasons..."
          value={cancelMessage}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleOnChange(e.target.value)
          }
        />
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={onCancel}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-base cursor-pointer"
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
