import { Router } from "oak";
import {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/books.ts";

const router = new Router();

router
  .get("/books", getBooks)
  .get("/books/:id", getBook)
  .post("/books", addBook)
  .put("/books/:id", updateBook)
  .delete("/books/:id", deleteBook);

export { router };
