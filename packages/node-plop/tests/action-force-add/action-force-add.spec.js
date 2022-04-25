import nodePlop from "../../src/index.js";
import * as fspp from "../../src/fs-promise-proxy.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("action-force-add", function () {
  afterEach(clean);

  /////
  // global and local "force" flag that can be used to push through failures
  //

  test("Action force add (global force)", async function () {
    const plop = await nodePlop("", { force: true });
    const filePath = `${testSrcPath}/test.txt`;
    const gen = plop.setGenerator("Gen", {
      actions: [
        {
          type: "add",
          template: "initial",
          path: filePath,
        },
        {
          type: "add",
          template: "overwrite",
          path: filePath,
        },
        {
          type: "add",
          template: "success",
          path: filePath,
          force: false, // will not be respected due to global flag
        },
      ],
    });

    const { changes, failures } = await gen.runActions({});
    const content = await fspp.readFile(filePath);

    expect(changes.length).toBe(3);
    expect(failures.length).toBe(0);
    expect(await fspp.fileExists(filePath)).toBeTruthy();
    expect(content).toBe("success");
  });

  test("Action force add (local action force)", async function () {
    const plop = await nodePlop();
    const filePath = `${testSrcPath}/test2.txt`;
    const gen = plop.setGenerator("Gen", {
      actions: [
        {
          type: "add",
          template: "initial",
          path: filePath,
        },
        {
          type: "add",
          template: "failure",
          path: filePath,
          abortOnFail: false,
        },
        {
          type: "add",
          template: "success",
          path: filePath,
          force: true,
        },
      ],
    });

    const { changes, failures } = await gen.runActions({});
    const content = await fspp.readFile(filePath);

    expect(changes.length).toBe(2);
    expect(failures.length).toBe(1);
    expect(await fspp.fileExists(filePath)).toBeTruthy();
    expect(content).toBe("success");
  });
});
