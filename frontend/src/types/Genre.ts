const Genre = {
  NOVEL: "Novel",
  MYSTERY: "Mystery",
  HISTORY: "History",
  PROGRAMMING: "Programming",
  SCIENCE: "Science",
  FANTASY: "Fantasy",
  ROMANCE: "Romance",
  BIOGRAPHY: "Biography",
  HORROR: "Horror",
  SCIENCE_FICTION: "Science Fiction",
  POETRY: "Poetry",
  THRILLER: "Thriller",
  PSYCHOLOGICAL: "Psychological",
  DRAMA: "Drama",
} as const;

type Genre = (typeof Genre)[keyof typeof Genre];

export default Genre;
