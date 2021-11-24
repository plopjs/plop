import { resolve, dirname } from "node:path";
import { renderPlop } from "./render.js";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  expect(await findByText(/^[\w\.-]+$/)).toBeTruthy();
});

test("should show version on v flag", async () => {
  const { findByText } = await renderPlop(["-v"]);
  expect(await findByText(/^[\w\.-]+$/)).toBeTruthy();
});

test("should display inquirer prompts", async () => {
  const { findByText, fireEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });
  expect(await findByText("What is your name?")).toBeTruthy();
  fireEvent.type("Joe");
  expect(await findByText("Joe")).toBeTruthy();
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

  expect(await findByText("this is a test")).toBeTruthy();

  fireEvent.sigterm();
});

test("Should bypass generator prompt", async () => {
  const { findByText, fireEvent } = await renderPlop(["test"], {
    cwd: resolve(__dirname, "./examples/javascript"),
  });

  expect(await findByText("What is your name?")).toBeTruthy();

  fireEvent.sigterm();
});

test("Should bypass prompt by input", async () => {
  const { queryByText, findByText, fireEvent } = await renderPlop(["Frank"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });

  expect(await queryByText("What is your name?")).toBeFalsy();
  expect(await findByText("What pizza toppings do you like?")).toBeTruthy();

  fireEvent.sigterm();
});

test("Should bypass prompt by input placeholder", async () => {
  const { queryByText, findByText, fireEvent } = await renderPlop(
    ["_", "Cheese"],
    {
      cwd: resolve(__dirname, "./examples/prompt-only"),
    }
  );

  expect(await findByText("What is your name?")).toBeTruthy();
  fireEvent.enter();
  expect(await queryByText("What pizza toppings do you like?")).toBeFalsy();

  fireEvent.sigterm();
});

test("Should bypass prompt by name", async () => {
  const { queryByText, findByText, fireEvent } = await renderPlop(
    ["--", "--name", "Frank"],
    {
      cwd: resolve(__dirname, "./examples/prompt-only"),
    }
  );

  expect(await queryByText("What is your name?")).toBeFalsy();
  expect(await findByText("What pizza toppings do you like?")).toBeTruthy();

  fireEvent.sigterm();
});

test.todo("Dynamic actions");
