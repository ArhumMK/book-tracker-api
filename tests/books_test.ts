Deno.test("Sanity check", () => {
  const result = 2 + 2;
  if (result !== 4) {
    throw new Error("Math is broken");
  }
});
