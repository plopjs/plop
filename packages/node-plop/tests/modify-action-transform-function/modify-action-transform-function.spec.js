import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("modify-action-transform-function", function () {
  afterEach(clean);

  let plop;
  beforeAll(async () => {
    plop = await nodePlop();
  });

  const genName = "add-then-modify";
  const fileName = "testFile";

  const addAction = {
    type: "add",
    template: `{{fileName}}${genName}`,
    path: `${testSrcPath}/{{fileName}}.txt`,
  };

  const modifyAction = {
    type: "modify",
    path: addAction.path,
  };

  test("Modify action fails without pattern or transform", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator(genName, {
      actions: [addAction, modifyAction],
    });

    const { failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, "utf8")).toBe(fileName + genName);
  });

  test("Modify action with standard usage", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const template = "template1";

    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        { ...modifyAction, pattern: new RegExp(genName), template },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(true);

    expect(fs.readFileSync(filePath, "utf8")).toBe(fileName + template);
  });

  test("Modify action with both pattern and transform", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const template = "template2";

    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
          pattern: new RegExp(genName),
          template,
          transform(templateOutput) {
            expect(templateOutput).toBe(fileName + template);

            return templateOutput.length.toString();
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath)).toBe(true);

    expect(fs.readFileSync(filePath, "utf8")).toBe(
      (fileName + template).length.toString(),
    );
  });

  test("Modify action with transform function only", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
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

    expect(fs.readFileSync(filePath, "utf8")).toBe(
      (fileName + genName).length.toString(),
    );
  });

  test("Modify action with async transform function", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");

    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
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

    expect(fs.readFileSync(filePath, "utf8")).toBe(
      (fileName + genName).length.toString(),
    );
  });

  test("Modify action with transform error", async function () {
    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
          transform() {
            throw "Whoops!";
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 1).toBe(true);
  });

  test("Modify action with async transform rejection", async function () {
    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
          async transform() {
            return Promise.reject("Whoops!");
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 1).toBe(true);
  });

  test("Modify action with async transform returns undefined", async function () {
    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
          async transform() {
            return;
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 1).toBe(true);
  });

  test("Modify action with async transform returns null", async function () {
    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
          async transform() {
            return null;
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 1).toBe(true);
  });

  test("Modify action with async transform returns invalid", async function () {
    const gen = plop.setGenerator(genName, {
      actions: [
        addAction,
        {
          ...modifyAction,
          async transform() {
            return { a: "a" };
          },
        },
      ],
    });

    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 1).toBe(true);
  });

  test('Modify action without pattern does not remove "undefined"', async function () {
    const template = "type SomeType = string | undefined;";

    const gen = plop.setGenerator(genName, {
      actions: [
        { ...addAction, template },
        {
          ...modifyAction,
          async transform(code) {
            expect(/undefined/.test(code)).toBe(true);
            return code;
          },
        },
      ],
    });

    const { changes, failures } = await gen.runActions({ fileName });

    expect(failures.length === 0).toBe(true);
    expect(changes.length === 2).toBe(true);
  });
});
