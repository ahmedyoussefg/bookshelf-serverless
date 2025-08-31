import { createContext } from "react";

interface BookListContextInterface {
  fetchBooks: () => Promise<void>;
}

const BookListContext = createContext<BookListContextInterface | undefined>(
  undefined
);

export default BookListContext;
