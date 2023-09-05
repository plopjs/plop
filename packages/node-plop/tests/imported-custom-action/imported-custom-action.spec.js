import { fileExists } from "../../src/fs-promise-proxy.js";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);
import { pathToFileURL } from "url";

describe("imported-custom-action", function () {
  afterEach(clean);

  /////
  // imported custom actions should execute
  //

  let customAction;
  beforeEach(async () => {
    customAction = (
      await import(
        pathToFileURL(path.resolve(mockPath, "custom-action.js")).href
      )
    ).default;
  });

  test("imported custom action should execute correctly", async function () {
    const plop = await nodePlop();
    const testFilePath = path.resolve(testSrcPath, "test.txt");
    plop.setActionType("custom-del", customAction);

    // add the file
    const addTestFile = { type: "add", path: testFilePath };
    // remove the file
    const deleteTestFile = { type: "custom-del", path: testFilePath };

    const generator = plop.setGenerator("", {
      actions: [addTestFile, deleteTestFile],
    });

    expect(typeof plop.getActionType("custom-del")).toBe("function");

    const results = await generator.runActions({});
    const testFileExists = await fileExists(testFilePath);

    expect(results.failures.length).toBe(0);
    expect(results.changes.length).toBe(2);
    expect(testFileExists).toBe(false);
  });

  test("imported custom action can throw errors", async function () {
    const plop = await nodePlop();
    const testFilePath = path.resolve(testSrcPath, "test2.txt");
    plop.setActionType("custom-del", customAction);

    // remove the file
    const deleteTestFile = { type: "custom-del", path: testFilePath };

    // remove a file that doesn't exist (should error)
    const generator = plop.setGenerator("", { actions: [deleteTestFile] });
    const results = await generator.runActions({});

    expect(results.failures.length).toBe(1);
    expect(results.failures[0].error.startsWith("Path does not exist")).toBe(
      true,
    );
  });
});
