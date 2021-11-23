const { renderPlop } = require("./render");

test("should report a missing plopfile when not copied", async () => {
  await expect(() => renderPlop()).rejects.toThrowErrorMatchingSnapshot();
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

// test("should display inquirer prompts", async (t) => {
//
// })
