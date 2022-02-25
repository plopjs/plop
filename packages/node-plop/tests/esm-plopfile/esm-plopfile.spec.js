import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("esm-plopfile", function () {
  afterEach(clean);

  test("Check that ESM default loads", async () => {
    const plop = await nodePlop(`${mockPath}/plopfile.js`);
    const basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Check that MJS loads", async () => {
    const plop = await nodePlop(`${mockPath}/plopfile.mjs`);
    const basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Check that CJS loads", async () => {
    const plop = await nodePlop(`${mockPath}/plopfile.cjs`);
    const basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  // TODO: Add these back once the following is fixed:
  // @see https://github.com/vitest-dev/vitest/issues/326
  test.skip("Check that CJS doesn't load", async () => {
    await expect(nodePlop(`${mockPath}/plopfile-cjs.js`)).rejects.toThrow();
  });

  test.skip("Check that incorrect (CJS) JS file doesn't load", async () => {
    await expect(nodePlop(`${mockPath}/plopfile-cjs.js`)).rejects.toThrow();
  });

  test.skip("Check that incorrect MJS doesn't load", async () => {
    await expect(nodePlop(`${mockPath}/plopfile-cjs.mjs`)).rejects.toThrow();
  });
});
