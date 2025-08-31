import { zodResolver } from "@hookform/resolvers/zod";
import type Book from "../types/Book";
import Genre from "../types/Genre";
import ReadStatus from "../types/ReadStatus";
import StarButton from "./StarButton";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { getEnumKeyByValue } from "../utils/enum-helper";
import { api } from "../api";
import { toast } from "react-toastify";
import { useBookList } from "../hooks/useBookList";

interface Props {
  isUpdateBook: boolean;
  onClose: () => void;
  book?: Book;
}

const bookSchema = z.object({
  title: z.string().nonempty("Title is required"),
  author: z.string().nonempty("Author is required"),
  genre: z.enum(Genre),
  owned: z.boolean(),
  readStatus: z.enum(ReadStatus),
  starred: z.boolean(),
});

type BookFields = z.infer<typeof bookSchema>;

// Add, Update Book modal
function BookModal({ isUpdateBook, onClose, book }: Props) {
  const { fetchBooks } = useBookList();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookFields>({
    defaultValues: {
      title: isUpdateBook ? book?.title : "",
      author: isUpdateBook ? book?.author : "",
      genre: isUpdateBook ? book?.genre : Genre.NOVEL,
      owned: isUpdateBook ? book?.owned : false,
      readStatus: isUpdateBook ? book?.readStatus : ReadStatus.WANT_TO_READ,
      starred: isUpdateBook ? book?.starred : false,
    },
    reValidateMode: "onSubmit",
    resolver: zodResolver(bookSchema),
  });

  const onSubmit: SubmitHandler<BookFields> = async (data: BookFields) => {
    console.log("Submitted Book:", data);
    const genreKey = getEnumKeyByValue(Genre, data.genre);
    const readStatus = getEnumKeyByValue(ReadStatus, data.readStatus);
    const reqBody = {
      ...data,
      genre: genreKey,
      readStatus: readStatus,
    };
    const toastId = toast.loading("Submitting...");
    try {
      if (isUpdateBook) {
        await api.patch(`/user/books/${book?.id}`, reqBody);
      } else {
        await api.post("/user/books", reqBody);
      }
      toast.update(toastId, {
        render: `Book ${isUpdateBook ? "updated" : "added"} successfully!`,
        type: "success",
        isLoading: false,
        closeButton: true,
        autoClose: 3000,
      });
      clearErrors();
      onClose();
      await fetchBooks();
    } catch (error: unknown) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
      });
      toast.update(toastId, {
        render: "Please try again",
        type: "error",
        isLoading: false,
        closeButton: true,
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-300/80  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isUpdateBook ? "Update Book" : "Add New Book"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              {...register("title")}
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              {...register("author")}
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors.author && (
              <p className="text-red-500 text-sm">{errors.author.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              {...register("genre")}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              {Object.values(Genre).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Read Status
            </label>
            <select
              {...register("readStatus")}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              {Object.values(ReadStatus).map((status) => (
                <option key={status} value={status} className="border">
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owned
            </label>
            <input
              {...register("owned")}
              type="checkbox"
              className="h-4 w-4 border-gray-300 rounded focus:ring-amber-500"
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starred
            </label>
            <StarButton
              initialStarred={book?.starred}
              onToggle={(value) => {
                setValue("starred", value);
              }}
            />
          </div>
          {errors.root && (
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {isSubmitting
                ? "Loading..."
                : isUpdateBook
                  ? "Update Book"
                  : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookModal;
