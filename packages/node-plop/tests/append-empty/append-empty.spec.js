import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("append-empty", function () {
  afterEach(clean);

  let plop;
  let makeList;
  let appendToList;

  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    makeList = plop.getGenerator("make-list");
    appendToList = plop.getGenerator("append-to-list");
  });

  test("Check if entry will be appended", async function () {
    await makeList.runActions({ listName: "test" });
    await appendToList.runActions({ listName: "test", name: "Marco" });
    await appendToList.runActions({ listName: "test", name: "Polo" });
    const filePath = path.resolve(testSrcPath, "test.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(content).toBe("Marco\nPolo");
  });
});
