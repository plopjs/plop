import { resolve, dirname } from "node:path";
import { waitFor } from "cli-testing-library";
import { renderPlop } from "./render.js";

import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("should exit with code 1 when failed actions", async () => {
  const result = await renderPlop([], {
    cwd: resolve(__dirname, "./examples/action-failure"),
  });
  const { findByText, userEvent } = result;
  expect(await findByText("What is your name?")).toBeTruthy();
  userEvent.keyboard("Joe");
  expect(await findByText("Joe")).toBeTruthy();
  userEvent.keyboard("[Enter]");
  const actionOutput = await findByText("Action failed");
  await waitFor(() =>
    expect(actionOutput.hasExit()).toStrictEqual({ exitCode: 1 })
  );
});
