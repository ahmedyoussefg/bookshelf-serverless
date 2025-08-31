import { useContext } from "react";
import BookListContext from "../contexts/BookListProvider";

export function useBookList() {
  const ctx = useContext(BookListContext);
  if (!ctx) throw new Error("useBookList must be used within BookListContext.Provider");
  return ctx;
}
