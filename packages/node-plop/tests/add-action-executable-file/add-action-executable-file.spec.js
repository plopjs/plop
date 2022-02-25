import fs from "fs";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("add-action-executable-file", () => {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  test("Add action keeps the executable flag", async function () {
    if (process.platform !== "win32") {
      plop.setGenerator("addExecutable", {
        actions: [
          {
            type: "add",
            path: `${testSrcPath}/added.sh`,
            templateFile: `${mockPath}/plop-templates/add.sh`,
          },
        ],
      });

      await plop.getGenerator("addExecutable").runActions();
      const destStats = fs.statSync(`${testSrcPath}/added.sh`);
      expect(destStats.mode & fs.constants.S_IXUSR).toBe(fs.constants.S_IXUSR);
    } else {
      // Windows, skip
      // eslint-disable-next-line no-constant-condition
      if (true) {
        expect(true).toBe(true);
        return;
      }
      plop.setGenerator("addExecutable", {
        actions: [
          {
            type: "add",
            path: `${testSrcPath}/added.sh`,
            templateFile: `${mockPath}/plop-templates/add.sh`,
          },
        ],
      });

      await plop.getGenerator("addExecutable").runActions();

      const destStats = fs.statSync(`${testSrcPath}/added.sh`);
      expect(destStats.mode & fs.constants.S_IXUSR).toBe(fs.constants.S_IXUSR);
    }
  });
});
