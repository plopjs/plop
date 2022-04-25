import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("append-on-string-regex-mock", function () {
  afterEach(clean);

  let plop;
  let makeRegex;
  let appendToRegex;

  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    makeRegex = plop.getGenerator("make-regex");
    appendToRegex = plop.getGenerator("append-to-regex");
  });

  test("Check if regex file has been created", async function () {
    await makeRegex.runActions({ regexName: "test" });
    const filePath = path.resolve(testSrcPath, "test.txt");

    expect(fs.existsSync(filePath), filePath).toBe(true);
  });

  test("Check if entry will be appended with correct regex'", async function () {
    await makeRegex.runActions({ regexName: "test1" });
    await appendToRegex.runActions({
      regexName: "test1",
      name: "regex",
      allowDuplicates: false,
    });
    const filePath = path.resolve(testSrcPath, "test1.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(
      (content.match(/\{handle: "\[data-regex\]", require: Regex \}\\,/g) || [])
        .length
    ).toBe(1);
  });
});
