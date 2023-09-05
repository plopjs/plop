import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
import { normalizePath } from "../../src/actions/_common-action-utils.js";

const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("action-data-cleanup", () => {
  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  afterEach(clean);

  // Make sure that props added by the action's data attr are cleaned up
  // after the action executes

  test("Action data cleanup", async function () {
    const actions = ["one", "two", "three"].map((fName) => ({
      type: "add",
      template: "",
      path: `${testSrcPath}//{{fName}}-{{unchanged}}.txt`,
      data: { fName, unchanged: `${fName}-unchanged` },
    }));
    const g = plop.setGenerator("", { actions });
    const { changes, failures } = await g.runActions({
      unchanged: "unchanged",
    });
    const addedFiles = changes
      .map((c) => normalizePath(c.path).split("/").slice(-1))
      .join("|");
    expect(addedFiles).toBe(
      "one-unchanged.txt|two-unchanged.txt|three-unchanged.txt",
    );
    expect(changes.length).toBe(3);
    expect(failures.length).toBe(0);
  });
});
