import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("load-nested-plopfile-generators", function () {
  afterAll(clean);

  let plop;
  beforeAll(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
  });

  /////
  // if an action has no path, the action should fail
  //

  test("nested generator should add file to main directory", async function () {
    const filePath = path.resolve(testSrcPath, "nested-nestman.txt");
    const generator = plop.getGenerator("basic-nested");
    expect(typeof generator.runPrompts).toBe("function");
    expect(typeof generator.runActions).toBe("function");
    expect(generator.name).toBe("basic-nested");

    const results = await generator.runActions({ name: "Nestman" });
    expect(results.changes.length).toBe(1);
    expect(results.failures.length).toBe(0);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("nested generator should not override existing helpers", async function () {
    const filePath = path.resolve(testSrcPath, "addman.txt");
    const generator = plop.getGenerator("basic-add");
    expect(typeof generator.runPrompts).toBe("function");
    expect(typeof generator.runActions).toBe("function");
    expect(generator.name).toBe("basic-add");

    const results = await generator.runActions({ name: "Addman" }).then();
    expect(results.changes.length).toBe(1);
    expect(results.failures.length).toBe(0);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
