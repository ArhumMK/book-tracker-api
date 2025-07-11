import {
  assertEquals,
  assertExists,
  assertMatch,
} from "jsr:@std/assert";

// Adjust this if your API port or host is different
const baseUrl = "http://localhost:8000";

Deno.test("GET /books should return an array", async () => {
  const res = await fetch(`${baseUrl}/books`);
  assertEquals(res.status, 200);

  const body = await res.json();
  assertEquals(Array.isArray(body), true);
});

Deno.test("POST /books should add a book", async () => {
  const newBook = {
    title: "Test Book",
    author: "Test Author",
  };

  const res = await fetch(`${baseUrl}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBook),
  });

  assertEquals(res.status, 201);
  const body = await res.json();

  assertExists(body.id);
  assertEquals(body.title, newBook.title);
  assertEquals(body.author, newBook.author);
});

Deno.test("GET /books/:id should return a book", async () => {
  // First, add a book
  const book = {
    title: "Lookup Test",
    author: "Author A",
  };

  const createRes = await fetch(`${baseUrl}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  const created = await createRes.json();

  // Now get that book
  const getRes = await fetch(`${baseUrl}/books/${created.id}`);
  assertEquals(getRes.status, 200);

  const fetched = await getRes.json();
  assertEquals(fetched.title, book.title);
  assertEquals(fetched.author, book.author);
});

Deno.test("PUT /books/:id should update a book", async () => {
  // Create book
  const book = {
    title: "Old Title",
    author: "Old Author",
  };

  const createRes = await fetch(`${baseUrl}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  const created = await createRes.json();

  // Update it
  const updated = {
    title: "New Title",
    author: "New Author",
  };

  const updateRes = await fetch(`${baseUrl}/books/${created.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  assertEquals(updateRes.status, 200);
  const body = await updateRes.json();
  assertEquals(body.title, updated.title);
  assertEquals(body.author, updated.author);
});

Deno.test("DELETE /books/:id should remove a book", async () => {
  // Create book
  const book = {
    title: "To Be Deleted",
    author: "Author X",
  };

  const createRes = await fetch(`${baseUrl}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });

  const created = await createRes.json();

  // Delete it
  const deleteRes = await fetch(`${baseUrl}/books/${created.id}`, {
    method: "DELETE",
  });

  assertEquals(deleteRes.status, 200);
  const body = await deleteRes.json();
  assertMatch(body.message, /deleted/i);
});
