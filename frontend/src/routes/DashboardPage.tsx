import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import BookList from "../components/BookList";
import Button from "../components/Button";
import { useCallback, useEffect, useState } from "react";
import BookModal from "../components/BookModal";
import type Book from "../types/Book";
import { api } from "../api";
import { toast } from "react-toastify";
import BookListContext from "../contexts/BookListProvider";
import Genre from "../types/Genre";
import ReadStatus from "../types/ReadStatus";

function DashboardPage() {
  const { auth } = useAuth();
  const [showStarred, setShowStarred] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = showStarred ? { starred: true } : {};
      const res = await api.get("/user/books", { params });
      // convert genre and readstatus to user friendly values
      const normalizeBook = (book: Book): Book => ({
        ...book,
        genre: Genre[book.genre as keyof typeof Genre],
        readStatus: ReadStatus[book.readStatus as keyof typeof ReadStatus],
      });
      setBooks(res.data.map(normalizeBook));
    } catch (error) {
      toast.error(
        (error as Error)?.message || "An error occured. Please try again.",
        {
          closeButton: true,
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  }, [showStarred]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  const handleAddBookClick = () => {
    // Open the book modal for adding a new book
    setSelectedBook(undefined); // reset
    setShowBookModal(true);
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
    setSelectedBook(undefined); // reset
  };

  const handleEditBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <Header username={auth?.username ?? "Guest"} />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-amber-900">
            {showStarred ? "Starred Books" : "Your Books"}
          </h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-amber-900 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={showStarred}
                onChange={(e) => setShowStarred(e.target.checked)}
                className="w-4 h-4 accent-amber-700 cursor-pointer"
              />
              Show starred only
            </label>

            <div className="w-32">
              <Button onClick={handleAddBookClick}>+ Add Book</Button>
            </div>
          </div>
        </div>
        <BookListContext.Provider value={{ fetchBooks }}>
          <BookList
            books={books}
            loading={loading}
            onBookEdit={handleEditBookClick}
          />
        </BookListContext.Provider>

        {showBookModal && (
          <BookListContext.Provider value={{ fetchBooks }}>
            <BookModal
              isUpdateBook={!!selectedBook}
              onClose={handleCloseBookModal}
              {...(selectedBook ? { book: selectedBook } : {})}
            />
          </BookListContext.Provider>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
