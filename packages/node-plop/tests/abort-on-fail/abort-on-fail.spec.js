import nodePlop from "../../src/index.js";

describe("abort-on-fail", () => {
  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  /////
  // if an action has no path, the action should fail
  //
  test("Check that abortOnFail:true prevents future actions", async function () {
    plop.setGenerator("abort-on-fail-true", {
      actions: [{ abortOnFail: true }, {}],
    });

    const results = await plop
      .getGenerator("abort-on-fail-true")
      .runActions({});
    const { changes, failures } = results;

    expect(changes.length).toBe(0);
    expect(failures.length).toBe(2);
    expect(failures[0].error).toBe("Invalid action (#1)");
    expect(failures[1].error).toBe("Aborted due to previous action failure");
  });

  test("Check that abortOnFail:false does not prevent future actions", async function () {
    plop.setGenerator("abort-on-fail-false", {
      actions: [{ abortOnFail: false }, {}],
    });

    const results = await plop
      .getGenerator("abort-on-fail-false")
      .runActions({});
    const { changes, failures } = results;

    expect(changes.length).toBe(0);
    expect(failures.length).toBe(2);
    expect(failures[1].error).not.toBe(
      "Aborted due to previous action failure",
    );
  });
});
