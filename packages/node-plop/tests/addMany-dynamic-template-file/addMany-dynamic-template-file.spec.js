import fs from "fs";
import path from "path";

import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("addMany-dynamic-template-file", function () {
  afterAll(clean);

  let plop;
  let dynamicTemplateAddMany;
  let multipleAddsResult;

  beforeAll(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    dynamicTemplateAddMany = plop.getGenerator("dynamic-template-add-many");
    multipleAddsResult = await dynamicTemplateAddMany.runActions({
      name: "John Doe",
      kind: "BarChart",
    });
  });

  test("Check that all files have been created", () => {
    const expectedFiles = [
      "john-doe-bar-chart/john-doe-bar-ctrl.js",
      "john-doe-bar-chart/john-doe-bar-tmpl.html",
      "john-doe-bar-chart/helpers/john-doe.js",
    ];
    expectedFiles.map((file) => {
      const filePath = path.resolve(testSrcPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    expect(
      multipleAddsResult.changes[0].path.includes(
        `${expectedFiles.length} files added`,
      ),
    ).toBe(true);
  });

  test("Test the content of the rendered file", () => {
    const filePath = path.resolve(
      testSrcPath,
      "john-doe-bar-chart/john-doe-bar-tmpl.html",
    );
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("name: John Doe")).toBe(true);
  });
});
