const test = require("ava");
const {
  runInstrumentedPlop,
  UP,
  DOWN,
  ENTER,
  syncWait,
} = require("./_test-utils");
const { resolve } = require("path");

const runExamplePlop = (args = []) =>
  runInstrumentedPlop(args, {
    cwd: resolve(__dirname, "../example"),
  });

test("Should fail", async (t) => {
  const { stdoutArr, stdin, cancel, clear, waitForNode, waitForData } =
    runExamplePlop([""]);

  await waitForNode;
  await waitForData();

  t.regex(stdoutArr.join("\n"), /Please choose a generator/);

  clear();
  stdin.write(UP);
  stdin.write(DOWN);
  stdin.write(ENTER);
  await waitForData();

  t.regex(stdoutArr.join("\n"), /this is a test/);
  cancel();
});
