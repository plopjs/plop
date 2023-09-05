import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("addMany-multiple-files", function () {
  afterEach(clean);

  let multipleAddsResult;
  let plop;

  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    const multipleAdds = plop.getGenerator("multiple-adds");
    multipleAddsResult = await multipleAdds.runActions({ name: "John Doe" });
  });

  test("Check that all files have been created", () => {
    const expectedFiles = [
      "john-doe/add.txt",
      "john-doe/another-add.txt",
      "john-doe/nested-folder/a-nested-add.txt",
      "john-doe/nested-folder/another-nested-add.txt",
      "john-doe/nested-folder/my-name-is-john-doe.txt",
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

  test("Check that all files have been when using a templateFiles array", () => {
    const expectedFiles = [
      "array-john-doe/add.txt",
      "array-john-doe/another-add.txt",
      "array-john-doe/nested-folder/a-nested-add.txt",
      "array-john-doe/nested-folder/another-nested-add.txt",
      "array-john-doe/nested-folder/my-name-is-john-doe.txt",
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

  test("Check that the base path is chopped from templateFiles path", () => {
    const expectedFiles = [
      "base-john-doe/a-nested-add.txt",
      "base-john-doe/another-nested-add.txt",
      "base-john-doe/my-name-is-john-doe.txt",
    ];
    expectedFiles.map((file) => {
      const filePath = path.resolve(testSrcPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    const expectedNotCreatedFiles = [
      "base-john-doe/add.txt",
      "base-john-doe/another-add.txt",
      "base-john-doe/plop-templates/add.txt",
      "base-john-doe/plop-templates/another-add.txt",
    ];
    expectedNotCreatedFiles.map((file) => {
      const filePath = path.resolve(testSrcPath, file);
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });

  test("Test the content of the rendered file add.txt", () => {
    const filePath = path.resolve(testSrcPath, "john-doe/add.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("name: John Doe")).toBe(true);
  });

  test("Test the content of the rendered file in nested folder", () => {
    const filePath = path.resolve(
      testSrcPath,
      "john-doe/nested-folder/a-nested-add.txt",
    );
    const content = fs.readFileSync(filePath).toString();

    expect(content.includes("constant name: JOHN_DOE")).toBe(true);
  });

  test("Test the base value is used to decide which files are created", () => {
    const expectedCreatedFiles = [
      "components/john-doe-ctrl.js",
      "components/john-doe-tmpl.html",
      "components/john-doe-plop-logo.png",
    ];
    expectedCreatedFiles.map((file) => {
      const filePath = path.resolve(testSrcPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    const expectedNotCreatedFiles = [
      "components/logic/john-doe-ctrl.js",
      "components/logic/john-doe-tmpl.html",
      "components/tests/john-doe._test.js",
      "components/john-doe._test.js",
    ];
    expectedNotCreatedFiles.map((file) => {
      const filePath = path.resolve(testSrcPath, file);
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });

  test("Check that all files including dot have been created", () => {
    const expectedFiles = [
      "john-doe-dot/.gitignore",
      "john-doe-dot/add.txt",
      "john-doe-dot/another-add.txt",
    ];
    expectedFiles.map((file) => {
      const filePath = path.resolve(testSrcPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
    expect(
      multipleAddsResult.changes[4].path.includes(
        `${expectedFiles.length} files added`,
      ),
    ).toBe(true);
  });
});
