export const validateBook = (title: unknown, author: unknown): boolean => {
  return typeof title === "string" && title.length > 1 &&
         typeof author === "string" && author.length > 1;
};
