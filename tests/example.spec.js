const { renderPlop, fireEvent } = require("./render");
const { resolve } = require("path");

const renderExamplePlop = (args = []) =>
  renderPlop(args, {
    cwd: resolve(__dirname, "./examples/javascript"),
  });

test("Should fail", async () => {
  const { findByText, cleanup } = await renderExamplePlop([""]);

  const inst = await findByText("Please choose a generator");

  cleanup();
  fireEvent.up(inst);
  fireEvent.down(inst);
  fireEvent.enter(inst);

  await findByText("this is a test");

  // TODO: manually sigkill
});
