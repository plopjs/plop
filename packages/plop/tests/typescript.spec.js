import { resolve, dirname } from "node:path";
import { renderScript } from "./render.js";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const renderWrapper = (...props) => {
  return renderScript(
    resolve(__dirname, "./examples/wrap-plop/index.js"),
    ...props,
  );
};

test("support typescript out of the box", async () => {
  const { findByText } = await renderWrapper([""], {
    cwd: resolve(__dirname, "./examples/typescript"),
  });

  expect(await findByText("What is your name?")).toBeInTheConsole();
});
