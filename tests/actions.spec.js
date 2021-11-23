const { renderPlop } = require("./render");
const { resolve } = require("path");
const { waitFor } = require("cli-testing-library");
const fs = require("fs");
const { getFileHelper } = require("./file-helper");
const { getFilePath } = getFileHelper();

test("Plop to add and rename files", async () => {
  const expectedFilePath = await getFilePath(
    "./examples/add-action/output/new-output.txt"
  );

  const { findByText, fireEvent } = await renderPlop(["addAndNameFile"], {
    cwd: resolve(__dirname, "./examples/add-action"),
  });

  expect(await findByText("What should the file name be?")).toBeTruthy();

  fireEvent.type("new-output");
  fireEvent.enter();

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = fs.readFileSync(expectedFilePath, "utf8");

  expect(data).toMatch(/Hello/);

  fireEvent.sigterm();
});

test("Plop to add and change file contents", async () => {
  const expectedFilePath = await getFilePath(
    "./examples/add-action/output/new-output.txt"
  );

  const { findByText, fireEvent } = await renderPlop(["addAndChangeFile"], {
    cwd: resolve(__dirname, "./examples/add-action"),
  });

  expect(await findByText("What's your name?")).toBeTruthy();

  fireEvent.type("Corbin");
  fireEvent.enter();

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = await fs.promises.readFile(expectedFilePath, "utf8");

  expect(data).toMatch(/Hi Corbin!/);

  fireEvent.sigterm();
});

test.todo("Test modify");
test.todo("Test append");
test.todo("Test built-in helpers");
test.todo("Test custom helpers");
