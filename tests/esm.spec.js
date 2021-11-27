import { resolve, dirname } from "node:path";
import { renderPlop } from "./render.js";

import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("should load ESM file", async () => {
  const { findByText, fireEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/esm"),
  });
  expect(await findByText("What is your name?")).toBeTruthy();
  fireEvent.type("Joe");
  expect(await findByText("Joe")).toBeTruthy();
  fireEvent.enter();
  fireEvent.sigterm();
});

test("should load MJS file", async () => {
  const { findByText, fireEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/mjs"),
  });
  expect(await findByText("What is your name?")).toBeTruthy();
  fireEvent.type("Joe");
  expect(await findByText("Joe")).toBeTruthy();
  fireEvent.enter();
  fireEvent.sigterm();
});

test.only("should load CJS file", async () => {
  const { findByText, fireEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/cjs"),
  });
  expect(await findByText("What is your name?")).toBeTruthy();
  fireEvent.type("Joe");
  expect(await findByText("Joe")).toBeTruthy();
  fireEvent.enter();
  fireEvent.sigterm();
});

test("should load JS module='commonjs' file", async () => {
  const { findByText, fireEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/cjs-js"),
  });
  expect(await findByText("What is your name?")).toBeTruthy();
  fireEvent.type("Joe");
  expect(await findByText("Joe")).toBeTruthy();
  fireEvent.enter();
  fireEvent.sigterm();
});
