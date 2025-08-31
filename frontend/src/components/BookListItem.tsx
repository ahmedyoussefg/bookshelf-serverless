import { Edit, Trash } from "lucide-react";
import type Book from "../types/Book";
import StarButton from "./StarButton";
import { useState } from "react";
import { useBookList } from "../hooks/useBookList";
import ConfirmationModal from "./ConfirmationModal";
import { toast } from "react-toastify";
import { api } from "../api";
interface Props {
  book: Book;
  onBookEdit: (book: Book) => void;
}

function BookListItem({ book, onBookEdit }: Props) {
  const { fetchBooks } = useBookList();
  const [showConfirm, setShowConfirm] = useState(false);
  const handleDelete = async () => {
    setShowConfirm(false); // close modal
    const toastId = toast.loading("Deleting book...");
    try {
      await api.delete(`/user/books/${book.id}`);
      toast.update(toastId, {
        render: "Book deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      await fetchBooks();
    } catch (error: unknown) {
      toast.update(toastId, {
        render:
          error instanceof Error ? error.message : "Failed to delete book.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }
  };

  const handleStarUpdate = async (value: boolean) => {
    const toastId = toast.loading(
      value ? "Starring book..." : "Unstarring book..."
    );
    try {
      await api.patch(`/user/books/${book.id}`, { starred: value });
      toast.update(toastId, {
        render: value
          ? "Book starred successfully!"
          : "Book unstarred successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
      await fetchBooks();
    } catch (error: unknown) {
      toast.update(toastId, {
        render:
          error instanceof Error
            ? error.message
            : "Failed to update star of book.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }
  };
  return (
    <div className="bg-white shadow-md rounded-xl border border-amber-200 p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-amber-900">{book.title}</h3>
        <p className="text-sm text-amber-700">by {book.author}</p>
        <p className="text-xs text-amber-600 mt-1 italic">{book.genre}</p>
        <p className="text-xs text-amber-700 mt-2">
          Status: <span className="font-medium">{book.readStatus}</span>
        </p>
        <p className="text-xs text-amber-700">
          Owned: {book.owned ? "✅" : "❌"}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <StarButton
          initialStarred={book.starred}
          onToggle={async (value) => {
            await handleStarUpdate(value);
          }}
        />
        <div className="flex gap-2">
          <button
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            title="Edit"
            onClick={() => {
              onBookEdit(book);
            }}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            className="text-red-600 cursor-pointer hover:text-red-800"
            title="Delete"
            onClick={() => setShowConfirm(true)}
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
      {showConfirm && (
        <ConfirmationModal
          title="Delete Book"
          message={`Are you sure you want to delete "${book.title}" by ${book.author}?`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default BookListItem;
