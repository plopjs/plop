import fs from "fs";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("force-del-outside-cwd", function () {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/sub/plopfile.js`);
  });

  // chdir doesn't like to work in modern versions of ava (or many other test frameworks)
  // EG: process.chdir() is not supported in workers
  // We should rewrite this test
  test.skip("Force del outside cwd test", async function () {
    process.chdir(`${mockPath}/sub`);
    fs.mkdirSync(testSrcPath);
    fs.writeFileSync(testSrcPath + "/test.txt", "init content");
    const testGen = plop.getGenerator("test");
    const { changes } = await testGen.runActions();
    const content = fs.readFileSync(testSrcPath + "/test.txt", "utf8");
    expect(changes.length).toBe(1);
    expect(content).toBe("test content");
  });
});
