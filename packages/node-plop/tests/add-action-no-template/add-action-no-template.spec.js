import * as fspp from "../../src/fs-promise-proxy.js";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("add-action-no-template", () => {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  test("Check that an empty file has been created", async function () {
    plop.setGenerator("no-template", {
      actions: [
        {
          type: "add",
          path: `${testSrcPath}/{{dashCase name}}.txt`,
        },
      ],
    });

    const name = "no-template";
    const results = await plop.getGenerator(name).runActions({ name });
    const { changes, failures } = results;
    const filePath = path.resolve(testSrcPath, `${name}.txt`);
    const content = await fspp.readFile(filePath);

    expect(changes.length).toBe(1);
    expect(failures.length).toBe(0);
    expect(await fspp.fileExists(filePath)).toBeTruthy();
    expect(content).toBe("");
  });
});
