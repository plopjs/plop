import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("basic-plopfile", function () {
  afterAll(clean);

  let plop;
  let basicAdd;
  beforeAll(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
  });

  test("Check that the file has been created", async () => {
    basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Test the content of the rendered file this-is-a-test.txt", async () => {
    basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "this-is-a-test.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("name: this is a test")).toBe(true);
    expect(content.includes("upperCase: THIS_IS_A_TEST")).toBe(true);
  });

  test("Test the content of the rendered file _THIS_IS_A_TEST.txt", async () => {
    const filePath = path.resolve(testSrcPath, "_THIS_IS_A_TEST.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("inline template: this is a test")).toBe(true);
    expect(content.includes("test: basic-plopfile-test")).toBe(true);
    expect(
      content.includes(
        "propertyPathTest: basic-plopfile-test-propertyPath-value-index-1",
      ),
    ).toBe(true);
  });

  test("Test the content of the rendered file change-me.txt", async () => {
    basicAdd = plop.getGenerator("basic-add");
    await basicAdd.runActions({ name: "this is a test", age: "21" });

    const filePath = path.resolve(testSrcPath, "change-me.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("this is a test: 21")).toBe(true);
    expect(
      content.includes("this is prepended! replaced => this-is-a-test: 21"),
    ).toBe(true);
  });
});
