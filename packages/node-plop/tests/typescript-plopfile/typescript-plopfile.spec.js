import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("typescript-plopfile", function () {
  afterEach(clean);

  test("Check that typescript default loads", async () => {
    const plop = await nodePlop(`${mockPath}/plopfile.ts`);
    const basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Check that mts ext loads", async () => {
    const plop = await nodePlop(`${mockPath}/plopfile.mts`);
    const basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Check that cts ext loads", async () => {
    const plop = await nodePlop(`${mockPath}/plopfile.cts`);
    const basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
