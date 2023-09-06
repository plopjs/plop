import { resolve, dirname } from "node:path";
import { renderPlop } from "./render.js";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("support typescript CJS out of the box", async () => {
  const { findByText } = await renderPlop([""], {
    cwd: resolve(__dirname, "./examples/typescript-cjs"),
  });

  expect(await findByText("What is your name?")).toBeInTheConsole();
});

test("support typescript ESM out of the box", async () => {
  const { findByText } = await renderPlop([""], {
    cwd: resolve(__dirname, "./examples/typescript-esm"),
  });

  expect(await findByText("What is your name?")).toBeInTheConsole();
});
