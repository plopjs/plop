import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("dynamic-template-file", function () {
  afterEach(clean);

  let plop;
  let dynamicTemplateAdd;
  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    dynamicTemplateAdd = plop.getGenerator("dynamic-template-add");
    await dynamicTemplateAdd.runActions({
      name: "this is a test",
      kind: "LineChart",
    });
  });

  test("Check that the file has been created", () => {
    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Test file this-is-a-test.txt has been rendered from line-chart.txt", () => {
    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("this is a line chart")).toBe(true);
    expect(content.includes("name: this is a test")).toBe(true);
  });

  test("Test file change-me.txt has been updated with line-chart.txt", () => {
    const filePath = path.resolve(testSrcPath, "change-me.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("this is a line chart")).toBe(true);
    expect(content.includes("name: this is a test")).toBe(true);
  });
});
