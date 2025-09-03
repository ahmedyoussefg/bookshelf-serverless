import Genre from "./Genre";
import ReadStatus from "./ReadStatus";

export default interface Book {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  owned: boolean;
  readStatus: ReadStatus;
  starred: boolean;
}
