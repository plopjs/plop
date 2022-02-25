import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("add-action-binary-file", () => {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  /////
  //
  //

  test("Add action does not fail on binary file", async function () {
    plop.setGenerator("addBinary", {
      actions: [
        {
          type: "add",
          path: `${testSrcPath}/{{dashCase name}}-plop-logo.png`,
          templateFile: `${mockPath}/plop-logo.png`,
        },
      ],
    });

    const filePath = path.resolve(testSrcPath, "test-plop-logo.png");
    await plop.getGenerator("addBinary").runActions({ name: "test" });
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
});
