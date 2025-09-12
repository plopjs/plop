import { resolve, dirname } from "node:path";
import { waitFor } from "cli-testing-library";
import * as fs from "node:fs";
import { renderPlop } from "./render.js";
import { getFileHelper } from "./file-helper.js";
const { getFilePath } = getFileHelper();
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("Plop to add and rename files", async () => {
  const expectedFilePath = await getFilePath(
    "./examples/add-action/output/new-output.txt",
  );

  const { findByText, userEvent } = await renderPlop(["addAndNameFile"], {
    cwd: resolve(__dirname, "./examples/add-action"),
  });

  expect(await findByText("What should the file name be?")).toBeInTheConsole();

  await userEvent.keyboard("new-output");
  await userEvent.keyboard("[Enter]");

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = fs.readFileSync(expectedFilePath, "utf8");

  expect(data).toMatch(/Hello/);
  expect(await findByText("++ /output/new-output.txt")).toBeInTheConsole();
});

test("Plop to add and change file contents", async () => {
  const expectedFilePath = await getFilePath(
    "./examples/add-action/output/new-output.txt",
  );

  const { findByText, userEvent } = await renderPlop(["addAndChangeFile"], {
    cwd: resolve(__dirname, "./examples/add-action"),
  });

  expect(await findByText("What's your name?")).toBeInTheConsole();

  await userEvent.keyboard("Corbin");
  await userEvent.keyboard("[Enter]");

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = await fs.promises.readFile(expectedFilePath, "utf8");

  expect(data).toMatch(/Hi Corbin!/);
  expect(await findByText("++ /output/new-output.txt")).toBeInTheConsole();
});

test.todo("Test modify");
test.todo("Test append");
test.todo("Test built-in helpers");
test.todo("Test custom helpers");

test("Plop to display a custom string for a given action type", async () => {
  const expectedFilePath = await getFilePath(
    "./examples/custom-action-display/output/out.txt"
  );

  const { findByText } = await renderPlop(["addFile"], {
    cwd: resolve(__dirname, "./examples/custom-action-display"),
  });

  await waitFor(() => fs.promises.stat(expectedFilePath));

  expect(await findByText(">< /output/out.txt")).toBeInTheConsole();
});
