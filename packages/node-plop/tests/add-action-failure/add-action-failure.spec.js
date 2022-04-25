import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("add-action-failure", () => {
  afterEach(clean);

  let plop;
  let baseAction;
  let actionAdd;
  let actionAddWithSkip;
  beforeEach(async () => {
    plop = await nodePlop();

    baseAction = {
      type: "add",
      template: "{{name}}",
      path: `${testSrcPath}/{{name}}.txt`,
    };
    actionAdd = plop.setGenerator("add-action", {
      actions: [baseAction],
    });
    actionAddWithSkip = plop.setGenerator("add-action-skip-exists-true", {
      actions: [Object.assign({}, baseAction, { skipIfExists: true })],
    });
  });

  test("Check that the file is created", async function () {
    const filePath = path.resolve(testSrcPath, "test1.txt");
    const result = await actionAdd.runActions({ name: "test1" });
    expect(result.changes.length).toBe(1);
    expect(result.failures.length).toBe(0);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });

  test("If run twice, should fail due to file already exists", async function () {
    const filePath = path.resolve(testSrcPath, "test2.txt");
    // add the test file
    const result = await actionAdd.runActions({ name: "test2" });
    expect(result.changes.length).toBe(1);
    expect(result.failures.length).toBe(0);
    expect(fs.existsSync(filePath)).toBeTruthy();
    // try to add it again
    const result2 = await actionAdd.runActions({ name: "test2" });
    expect(result2.changes.length).toBe(0);
    expect(result2.failures.length).toBe(1);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });

  test("If skipIfExists is true, it should not fail", async function () {
    const filePath = path.resolve(testSrcPath, "test3.txt");
    // add the test file
    const result = await actionAdd.runActions({ name: "test3" });
    expect(result.changes.length).toBe(1);
    expect(result.failures.length).toBe(0);
    expect(fs.existsSync(filePath)).toBeTruthy();
    // try to add it again
    const result2 = await actionAddWithSkip.runActions({ name: "test3" });
    expect(result2.changes.length).toBe(1);
    expect(result2.failures.length).toBe(0);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
});
