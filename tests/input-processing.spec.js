const { renderPlop } = require("./render");
const { resolve } = require("path");

test("should report a missing plopfile when not copied", async () => {
  await expect(() => renderPlop()).rejects.toMatchInlineSnapshot(
    /\[PLOP\] No plopfile found/,
    `Object {}`
  );
});

test("should show help information on help flag", async () => {
  const { findByText } = await renderPlop(["--help"]);
  const { stdoutStr } = await findByText("Usage:");
  expect(stdoutStr).toMatchSnapshot();
});

test("should show version on version flag", async () => {
  const { findByText } = await renderPlop(["--version"]);
  await findByText(/^[\w\.-]+$/);
});

test("should show version on v flag", async () => {
  const { findByText } = await renderPlop(["-v"]);
  await findByText(/^[\w\.-]+$/);
});

test("should display inquirer prompts", async () => {
  const { findByText, fireEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });
  await findByText("What is your name?");
  fireEvent.type("Joe");
  await findByText("Joe");
  fireEvent.enter();
  fireEvent.sigterm();
});

test("Should handle generator prompt", async () => {
  const { findByText, cleanup, fireEvent } = await renderPlop([""], {
    cwd: resolve(__dirname, "./examples/javascript"),
  });

  await findByText("Please choose a generator");

  cleanup();
  fireEvent.up();
  fireEvent.down();
  fireEvent.enter();

  await findByText("this is a test");

  fireEvent.sigterm();
});

test("Should bypass generator prompt", async () => {
  const { findByText, fireEvent } = await renderPlop(["test"], {
    cwd: resolve(__dirname, "./examples/javascript"),
  });

  await findByText("What is your name?");

  fireEvent.sigterm();
});
