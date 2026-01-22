import { resolve, dirname } from "node:path";
import { renderPlop } from "./render.js";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("should show help on -h flag", async () => {
  const { findByText } = await renderPlop(["-h"]);
  const { stdoutArr } = await findByText("Usage:");
  expect(stdoutArr.map((item) => item.contents).join("\n")).toMatchSnapshot();
});

test("should show help on --help flag", async () => {
  const { findByText } = await renderPlop(["--help"]);
  expect(await findByText("Usage:")).toBeInTheConsole();
});

test("should accept --force flag", async () => {
  const { findByText } = await renderPlop(["--force"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });
  expect(await findByText("What is your name?")).toBeInTheConsole();
});

test("should accept -f flag", async () => {
  const { findByText } = await renderPlop(["-f"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });
  expect(await findByText("What is your name?")).toBeInTheConsole();
});

test("should accept --plopfile option", async () => {
  const { findByText } = await renderPlop(
    ["--plopfile", resolve(__dirname, "./examples/prompt-only/plopfile.js")],
    {
      cwd: resolve(__dirname, "../../../.."),
    },
  );
  expect(await findByText("What is your name?")).toBeInTheConsole();
});

test("should accept --cwd option", async () => {
  const { findByText } = await renderPlop([
    "--cwd",
    resolve(__dirname, "./examples/prompt-only"),
  ]);
  expect(await findByText("What is your name?")).toBeInTheConsole();
});

test("should bypass with --flag=value syntax", async () => {
  const { queryByText, findByText } = await renderPlop(["--", "--name=Frank"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });

  expect(await queryByText("What is your name?")).not.toBeInTheConsole();
  expect(
    await findByText("What pizza toppings do you like?"),
  ).toBeInTheConsole();
});

test("should handle multiple named args after --", async () => {
  const { queryByText } = await renderPlop(
    ["--", "--name", "Frank", "--toppings", "Cheese"],
    {
      cwd: resolve(__dirname, "./examples/prompt-only"),
    },
  );

  expect(await queryByText("What is your name?")).not.toBeInTheConsole();
  expect(
    await queryByText("What pizza toppings do you like?"),
  ).not.toBeInTheConsole();
});

test("should handle boolean flag followed by another flag", async () => {
  const { findByText } = await renderPlop(["--force", "--help"]);
  expect(await findByText("Usage:")).toBeInTheConsole();
});

test("should handle init flag", async () => {
  const { findByError } = await renderPlop(["--init"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });
  // --init in a directory with existing plopfile should error
  expect(await findByError(/already exists/)).toBeInTheConsole();
});

test("should handle -i flag", async () => {
  const { findByError } = await renderPlop(["-i"], {
    cwd: resolve(__dirname, "./examples/prompt-only"),
  });
  expect(await findByError(/already exists/)).toBeInTheConsole();
});
