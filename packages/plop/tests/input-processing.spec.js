import { resolve, dirname } from "node:path";
import { renderPlop } from "./render.js";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("should report a missing plopfile when not copied", async () => {
  // The directory above this repo. We look up towards `plopfile.js` and found one at root otherwise.
  const cwd = resolve(__dirname, "../../../..");
  const { findByError } = await renderPlop([], { cwd });
  expect(await findByError(/\[PLOP\] No plopfile found/)).toBeInTheConsole();
});

test("should show help information on help flag", async () => {
  const { findByText } = await renderPlop(["--help"]);
  const { stdoutArr } = await findByText("Usage:");
  expect(stdoutArr.map((item) => item.contents).join("\n")).toMatchSnapshot();
});

test("should show version on version flag", async () => {
  const { findByText } = await renderPlop(["--version"]);
  expect(await findByText(/^[\w\.-]+$/)).toBeInTheConsole();
});

test("should show version on v flag", async () => {
  const { findByText } = await renderPlop(["-v"]);
  expect(await findByText(/^[\w\.-]+$/)).toBeInTheConsole();
});

test("should display inquirer prompts", async () => {
  const { findByText, userEvent } = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });
  expect(await findByText("What is your name?")).toBeInTheConsole();
  await userEvent.keyboard("Joe");
  expect(await findByText("Joe")).toBeInTheConsole();
  await userEvent.keyboard("[Enter]");
});

test("Should handle generator prompt", async () => {
  const { findByText, clear, userEvent } = await renderPlop([""], {
    cwd: resolve(__dirname, "./examples/javascript"),
  });

  await findByText("Please choose a generator");

  clear();
  await userEvent.keyboard("[ArrowUp]");
  await userEvent.keyboard("[ArrowDown]");
  await userEvent.keyboard("[Enter]");

  expect(await findByText("this is a test")).toBeInTheConsole();
});

test("Should bypass generator prompt", async () => {
  const { findByText } = await renderPlop(["test"], {
    cwd: resolve(__dirname, "./examples/javascript"),
  });

  expect(await findByText("What is your name?")).toBeInTheConsole();
});

test("Should bypass input prompt with input", async () => {
  const { queryByText, findByText } = await renderPlop(["Frank"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });

  expect(await queryByText("What is your name?")).not.toBeInTheConsole();
  expect(
    await findByText("What pizza toppings do you like?"),
  ).toBeInTheConsole();
});

test("Should bypass input prompt with placeholder", async () => {
  const { queryByText, findByText, userEvent } = await renderPlop(
    ["_", "Cheese"],
    {
      cwd: resolve(__dirname, "./examples/prompt-only"),
    },
  );

  expect(await findByText("What is your name?")).toBeInTheConsole();
  await userEvent.keyboard("[Enter]");
  expect(
    await queryByText("What pizza toppings do you like?"),
  ).not.toBeInTheConsole();
});

test("Should bypass input prompt with name", async () => {
  const { queryByText, findByText } = await renderPlop(
    ["--", "--name", "Frank"],
    {
      cwd: resolve(__dirname, "./examples/prompt-only"),
    },
  );

  expect(await queryByText("What is your name?")).not.toBeInTheConsole();
  expect(
    await findByText("What pizza toppings do you like?"),
  ).toBeInTheConsole();
});

test("Should bypass input prompt with empty string", async () => {
  const { queryByText, findByText } = await renderPlop(["--", "--name", `""`], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });

  expect(await queryByText("What is your name?")).not.toBeInTheConsole();
  expect(
    await findByText("What pizza toppings do you like?"),
  ).toBeInTheConsole();
});

test("Should bypass checkbox prompt with input", async () => {
  const { queryByText } = await renderPlop(["Frank", "Cheese"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });

  expect(await queryByText("What is your name?")).not.toBeInTheConsole();
  expect(
    await queryByText("What pizza toppings do you like?"),
  ).not.toBeInTheConsole();
});

test("Should bypass checkbox prompt with placeholder", async () => {
  const { queryByText, findByText } = await renderPlop(["Frank", "_"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });

  expect(await queryByText("What is your name?")).not.toBeInTheConsole();
  expect(
    await findByText("What pizza toppings do you like?"),
  ).toBeInTheConsole();
});

test("Should bypass checkbox prompt with name", async () => {
  const { queryByText, findByText, userEvent } = await renderPlop(
    ["--", "--toppings", "Cheese"],
    {
      cwd: resolve(__dirname, "./examples/prompt-only"),
    },
  );

  expect(await findByText("What is your name?")).toBeInTheConsole();
  await userEvent.keyboard("[Enter]");
  expect(
    await queryByText("What pizza toppings do you like?"),
  ).not.toBeInTheConsole();
});

test("Should bypass checkbox prompt with empty string", async () => {
  const { queryByText, findByText, userEvent } = await renderPlop(
    ["--", "--toppings", `""`],
    {
      cwd: resolve(__dirname, "./examples/prompt-only"),
    },
  );

  expect(await findByText("What is your name?")).toBeInTheConsole();
  await userEvent.keyboard("[Enter]");
  expect(
    await queryByText("What pizza toppings do you like?"),
  ).not.toBeInTheConsole();
});

test.todo("Dynamic actions");
