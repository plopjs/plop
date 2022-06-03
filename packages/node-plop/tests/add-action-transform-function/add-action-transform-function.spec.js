import fs from "fs";
import path from "path";

import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("add-action-transform-function", function () {
  afterEach(clean);

  let plop;
  beforeAll(async () => {
    plop = await nodePlop();
  });

  const baseAction = {
    type: "add",
    template: "{{fileName}}",
    path: `${testSrcPath}/{{fileName}}.txt`,
  };

  test("Add action without transform function", async function () {
    const fileName = "testFile1";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", { actions: [baseAction] });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, "utf8")).toBe(fileName);
  });

  test("Add action transform function", async function () {
    const fileName = "testFile2";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", {
      actions: [
        {
          ...baseAction,
          transform(templateOutput) {
            return templateOutput.length.toString();
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, "utf8")).toBe(fileName.length.toString());
  });

  test("Add action async transform function", async function () {
    const fileName = "testFile3";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", {
      actions: [
        {
          ...baseAction,
          async transform(templateOutput) {
            return templateOutput.length.toString();
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, "utf8")).toBe(fileName.length.toString());
  });

  test("Add action transform error", async function () {
    const fileName = "testFile4";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", {
      actions: [
        {
          ...baseAction,
          transform() {
            throw "Whoops!";
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  test("Add action async transform rejection", async function () {
    const fileName = "testFile5";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", {
      actions: [
        {
          ...baseAction,
          async transform() {
            return Promise.reject("Whoops!");
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  test("Add action async transform returns undefined", async function () {
    const fileName = "testFile6";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", {
      actions: [
        {
          ...baseAction,
          async transform() {
            return;
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  test("Add action async transform returns null", async function () {
    const fileName = "testFile7";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", {
      actions: [
        {
          ...baseAction,
          async transform() {
            return null;
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  test("Add action async transform returns invalid", async function () {
    const fileName = "testFile8";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator("add-action", {
      actions: [
        {
          ...baseAction,
          async transform() {
            return { a: "a" };
          },
        },
      ],
    });

    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(false);
  });
});
