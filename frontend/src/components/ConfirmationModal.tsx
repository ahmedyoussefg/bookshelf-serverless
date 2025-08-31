import { X } from "lucide-react";

interface Props {
  message: string;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}
function ConfirmationModal({ message, title, onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6 border border-amber-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-amber-900">{title}</h2>
          <button
            onClick={onCancel}
            className="text-amber-600 hover:text-amber-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-amber-800 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
