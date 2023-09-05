import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("addMany-strip-extensions", function () {
  afterEach(clean);

  let plop;
  let multipleAdds;
  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    multipleAdds = plop.getGenerator("add-many-strip-extensions");
    await multipleAdds.runActions({ name: "John Doe" });
  });

  test("Check that all files generated without hbs extension", () => {
    const nonSpecPath = path.resolve(
      testSrcPath,
      "remove-hbs/john-doe-my-view.js",
    );
    const specPath = path.resolve(
      testSrcPath,
      "remove-hbs/john-doe-my-view._test.js",
    );

    expect(fs.existsSync(nonSpecPath)).toBe(true);
    expect(fs.existsSync(specPath)).toBe(true);
  });

  test("Check that all files generated with all extensions removed", () => {
    const nonSpecPath = path.resolve(testSrcPath, "remove-all/my-view._test");
    const specPath = path.resolve(testSrcPath, "remove-all/my-view._test.js");

    expect(fs.existsSync(nonSpecPath)).toBe(true);
    expect(fs.existsSync(specPath)).toBe(true);
  });

  test("Check that dot files generated without hbs extension", () => {
    const dotPath = path.resolve(testSrcPath, "remove-dotfile-hbs/.gitignore");
    const dotPathWithExtension = path.resolve(
      testSrcPath,
      "remove-dotfile-hbs/.eslintrc.cjs",
    );

    expect(fs.existsSync(dotPath)).toBe(true);
    expect(fs.existsSync(dotPathWithExtension)).toBe(true);
  });
});
