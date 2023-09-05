import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("dynamic-actions", function () {
  afterEach(clean);

  let plop;
  let dynamicActions;
  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    dynamicActions = plop.getGenerator("dynamic-actions");
  });

  test("Check that the potato-man-burger.txt file has been created", async () => {
    await dynamicActions.runActions({ name: "potato man", yesPotatoes: true });
    const burgerFilePath = path.resolve(testSrcPath, "potato-man-burger.txt");
    const potatoFilePath = path.resolve(testSrcPath, "potato-man-burger.txt");

    // both files should have been created
    expect(fs.existsSync(burgerFilePath)).toBe(true);
    expect(fs.existsSync(potatoFilePath)).toBe(true);
  });

  test("Check that the file potato-hater-burger.txt", async () => {
    await dynamicActions.runActions({
      name: "potato hater",
      yesPotatoes: false,
    });
    const burgerFilePath = path.resolve(testSrcPath, "potato-hater-burger.txt");
    const potatoFilePath = path.resolve(
      testSrcPath,
      "potato-hater-potatoes.txt",
    );

    // only the burger file should have been created
    expect(fs.existsSync(burgerFilePath)).toBe(true);
    expect(fs.existsSync(potatoFilePath)).toBe(false);
  });
});
