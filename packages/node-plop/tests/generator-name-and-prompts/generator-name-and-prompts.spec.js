import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("generator-name-and-prompts", function () {
  afterEach(clean);

  ///////
  // generator name should be defaulted
  // runPrompts should reject if there are no prompts
  //

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();

    plop.setGenerator("", {});
    plop.setGenerator("bad-actions-function", {
      actions: () => {
        "bad actions output";
      },
    });
  });

  test("generator should not be able to run promps if it has none", async function () {
    const generatorOne = plop.getGenerator("generator-1");
    expect(typeof generatorOne).toBe("object");

    await expect(() => generatorOne.runPrompts()).rejects.toThrow(
      "generator-1 has no prompts",
    );
  });

  test("generator should not be able to run actions if it has none", async function () {
    const generatorOne = plop.getGenerator("generator-1");
    expect(typeof generatorOne).toBe("object");

    await expect(() => generatorOne.runActions()).rejects.toThrow(
      "generator-1 has no actions",
    );
  });

  test("generator should not be able to run invalid actions data", async function () {
    const generatorBadActions = plop.getGenerator("bad-actions-function");

    await expect(() => generatorBadActions.runActions()).rejects.toThrow(
      "bad-actions-function has no actions",
    );
  });
});
