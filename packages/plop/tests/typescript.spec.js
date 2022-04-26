import { resolve, dirname } from "node:path";
import { waitFor } from "cli-testing-library";
import { renderScript } from "./render.js";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const renderWrapper = (...props) => {
  return renderScript(
    resolve(__dirname, "./examples/wrap-plop/index.js"),
    ...props
  );
};

test("wrapper should prompts", async () => {
  const props = await renderScript("yarn", ["tsc"], {
    cwd: resolve(__dirname, "./examples/typescript"),
  });
  await waitFor(() => props.hasExit());
  const { findByText } = await renderWrapper([""], {
    cwd: resolve(__dirname, "./examples/typescript"),
  });

  expect(await findByText("What is your name?")).toBeInTheConsole();
});
