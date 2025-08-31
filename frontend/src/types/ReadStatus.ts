const ReadStatus = {
  WANT_TO_READ: "Want to Read",
  READING: "Reading",
  FINISHED: "Finished",
} as const;

type ReadStatus = (typeof ReadStatus)[keyof typeof ReadStatus];

export default ReadStatus;
