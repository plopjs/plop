const { renderScript, renderPlop } = require("./render");
const { resolve } = require("path");
const { waitFor } = require("cli-testing-library");
const fs = require("fs");

const renderWrapper = (...props) => {
  return renderScript(
    resolve(__dirname, "./examples/wrap-plop/index.js"),
    ...props
  );
};

test("wrapper should show version on v flag", async () => {
  const { findByText } = await renderWrapper(["-v"]);

  expect(await findByText(/^[\w\.-]+$/)).toBeTruthy();
});

test("wrapper should prompts", async () => {
  const { findByText, fireEvent } = await renderWrapper([""], {
    cwd: resolve(__dirname, "./examples/wrap-plop"),
  });

  expect(await findByText("What is your name?")).toBeTruthy();
  fireEvent.sigterm();
});

test("wrapper should bypass prompts with index", async () => {
  const { findByText, queryByText, fireEvent } = await renderWrapper(
    ["Corbin"],
    {
      cwd: resolve(__dirname, "./examples/wrap-plop"),
    }
  );

  expect(await queryByText("What is your name?")).toBeFalsy();
  expect(await findByText("What pizza toppings do you like?")).toBeTruthy();
  fireEvent.sigterm();
});

test("wrapper should bypass prompts with name", async () => {
  const { findByText, queryByText, fireEvent } = await renderWrapper(
    ["--name", "Corbin"],
    {
      cwd: resolve(__dirname, "./examples/wrap-plop"),
    }
  );

  expect(await queryByText("What is your name?")).toBeFalsy();
  expect(await findByText("What pizza toppings do you like?")).toBeTruthy();
  fireEvent.sigterm();
});

test("can run actions (add)", async () => {
  const { fireEvent } = await renderPlop(["Test", "Cheese"], {
    cwd: resolve(__dirname, "./examples/wrap-plop"),
  });

  const expectedFilePath = resolve(
    __dirname,
    "./examples/wrap-plop/output/added.txt"
  );

  await waitFor(() => fs.promises.stat(expectedFilePath));

  const data = fs.readFileSync(expectedFilePath, "utf8");

  expect(data).toMatch(/Hello/);

  fs.unlinkSync(expectedFilePath);

  fireEvent.sigterm();
});
