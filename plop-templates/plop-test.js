import { resolve, dirname } from "node:path";
import { renderPlop } from "./render.js";

import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("should load ESM file", async () => {
  const { findByText, userEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/esm"),
  });
  expect(await findByText("What is your name?")).toBeInTheConsole();
  await userEvent.keyboard("Joe");
  expect(await findByText("Joe")).toBeInTheConsole();
  await userEvent.keyboard("[Enter]");
});
