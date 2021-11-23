const { renderPlop } = require("./render");
const { resolve } = require("path");
const { waitFor } = require("cli-testing-library");
const fs = require("fs");

test("Plop to add and rename files", async () => {
  const { findByText, fireEvent } = await renderPlop(["addAndNameFile"], {
    cwd: resolve(__dirname, "./examples/add-action"),
    debug: true,
  });

  expect(await findByText("What should the file name be?")).toBeTruthy();

  fireEvent.type("new-output");
  fireEvent.enter();

  const expectedFilePath = resolve(
    __dirname,
    "./examples/add-action/output/new-output.txt"
  );

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = fs.readFileSync(expectedFilePath, "utf8");

  expect(data).toMatch(/Hello/);

  fs.unlinkSync(expectedFilePath);

  fireEvent.sigterm();
});

test("Plop to add and change file contents", async () => {
  const { findByText, fireEvent } = await renderPlop(["addAndChangeFile"], {
    cwd: resolve(__dirname, "./examples/add-action"),
    debug: true,
  });

  expect(await findByText("What's your name?")).toBeTruthy();

  fireEvent.type("Corbin");
  fireEvent.enter();

  const expectedFilePath = resolve(
    __dirname,
    "./examples/add-action/output/to-add-change.txt"
  );

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = fs.readFileSync(expectedFilePath, "utf8");

  expect(data).toMatch(/Hi Corbin!/);

  fs.unlinkSync(expectedFilePath);

  fireEvent.sigterm();
});
