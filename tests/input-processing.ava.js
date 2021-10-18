const test = require("ava");
const { runInstrumentedPlop } = require("./_test-utils");

test("should report a missing plopfile when not copied", async (t) => {
  await t.throwsAsync(
    async () => {
      await runInstrumentedPlop();
    },
    {
      message: /\[PLOP\] No plopfile found/,
    }
  );
});

test("should show help information on help flag", async (t) => {
  const { stdout } = await runInstrumentedPlop("--help");
  t.regex(stdout, /Usage:/);
  t.snapshot(stdout);
});

test("should show version on version flag", async (t) => {
  const { stdout } = await runInstrumentedPlop("--version");
  t.regex(stdout, /^[\w\.-]+$/);
});

test("should show version on v flag", async (t) => {
  const { stdout } = await runInstrumentedPlop("-v");
  t.regex(stdout, /^[\w\.-]+$/);
});
