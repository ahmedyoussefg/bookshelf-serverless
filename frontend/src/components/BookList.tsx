import type Book from "../types/Book";
import BookListItem from "./BookListItem";
import { LoaderCircle, SearchX } from "lucide-react";

interface Props {
  books: Book[];
  onBookEdit: (book: Book) => void;
  loading?: boolean;
}
function BookList({ books, onBookEdit, loading = false }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-amber-700">
        <LoaderCircle className="h-8 w-8 animate-spin mb-3" />
        <p className="text-lg font-medium">Loading books...</p>
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-amber-700">
        <SearchX className="h-10 w-10 mb-3" />
        <p className="text-lg font-medium">No books found</p>
        <p className="text-sm text-gray-500 mt-1">Try adding a new book.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookListItem key={book.id} book={book} onBookEdit={onBookEdit}/>
      ))}
    </div>
  );
}

export default BookList;
