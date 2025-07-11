import type { RouterContext } from "oak";
import books from "../data/books.json" with { type: "json" };
import { validateBook } from "../utils/validate.ts";

let data = books;

export const getBooks = (ctx: RouterContext<"/books">) => {
  ctx.response.body = data;
};

// Get a specific book by ID
export const getBook = (ctx: RouterContext<"/books/:id">) => {
  const book = data.find((b) => b.id === ctx.params.id);
  if (book) {
    ctx.response.body = book;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Book not found" };
  }
};

// Add a new book
export const addBook = async (ctx: RouterContext<"/books">) => {
  const body = await ctx.request.body().value;
  const { title, author } = body;

  if (!validateBook(title, author)) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Invalid book data" };
    return;
  }

  const newBook = {
    id: crypto.randomUUID(),
    title,
    author,
  };

  data.push(newBook);
  ctx.response.status = 201;
  ctx.response.body = newBook;
};

// Update an existing book
export const updateBook = async (ctx: RouterContext<"/books/:id">) => {
  const book = data.find((b) => b.id === ctx.params.id);
  if (!book) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Book not found" };
    return;
  }

  const { title, author } = await ctx.request.body().value;

  if (!validateBook(title, author)) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Invalid book data" };
    return;
  }

  book.title = title;
  book.author = author;
  ctx.response.body = book;
};

// Delete a book
export const deleteBook = (ctx: RouterContext<"/books/:id">) => {
  const index = data.findIndex((b) => b.id === ctx.params.id);
  if (index === -1) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Book not found" };
    return;
  }

  data.splice(index, 1);
  ctx.response.body = { message: "Book deleted" };
};
