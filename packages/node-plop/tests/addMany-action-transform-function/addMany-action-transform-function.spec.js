import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("addMany-action-transform-function", function () {
  afterEach(clean);

  let plop;
  beforeAll(async () => {
    plop = await nodePlop();
  });

  const dataProp = "testFile";
  const filePath1 = path.resolve(testSrcPath, "file1.txt");
  const filePath2 = path.resolve(testSrcPath, "file2.txt");

  const addManyAction = {
    type: "addMany",
    base: mockPath,
    destination: testSrcPath,
    templateFiles: `${mockPath}/*.hbs`,
    verbose: true,
  };

  test("addMany action without transform function", async () => {
    const gen = plop.setGenerator("addMany-action", {
      actions: [addManyAction],
    });
    const { changes, failures } = await gen.runActions({ dataProp });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath1)).toBe(true);
    expect(fs.existsSync(filePath2)).toBe(true);

    expect(fs.readFileSync(filePath1, "utf8")).toBe(`file1 ${dataProp}`);
    expect(fs.readFileSync(filePath2, "utf8")).toBe(`file2 ${dataProp}`);
  });

  test("addMany action transform function", async function () {
    const gen = plop.setGenerator("addMany-action", {
      actions: [
        {
          ...addManyAction,
          transform(templateOutput) {
            return templateOutput.length.toString();
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ dataProp });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath1)).toBe(true);
    expect(fs.existsSync(filePath2)).toBe(true);

    expect(fs.readFileSync(filePath1, "utf8")).toBe("14");
    expect(fs.readFileSync(filePath2, "utf8")).toBe("14");
  });

  test("addMany action async transform function", async function () {
    const gen = plop.setGenerator("addMany-action", {
      actions: [
        {
          ...addManyAction,
          async transform(templateOutput) {
            return templateOutput.length.toString();
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ dataProp });

    expect(failures.length === 0).toBe(true);
    expect(changes.length > 0).toBe(true);

    expect(fs.existsSync(filePath1)).toBe(true);
    expect(fs.existsSync(filePath2)).toBe(true);

    expect(fs.readFileSync(filePath1, "utf8")).toBe("14");
    expect(fs.readFileSync(filePath2, "utf8")).toBe("14");
  });

  test("addMany action transform error", async function () {
    const gen = plop.setGenerator("addMany-action", {
      actions: [
        {
          ...addManyAction,
          transform() {
            throw "Whoops!";
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ dataProp });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath1)).toBe(false);
    expect(fs.existsSync(filePath2)).toBe(false);
  });

  test("addMany action async transform rejection", async function () {
    const gen = plop.setGenerator("addMany-action", {
      actions: [
        {
          ...addManyAction,
          async transform() {
            return Promise.reject("Whoops!");
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ dataProp });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath1)).toBe(false);
    expect(fs.existsSync(filePath2)).toBe(false);
  });

  test("addMany action async transform returns undefined", async function () {
    const gen = plop.setGenerator("addMany-action", {
      actions: [
        {
          ...addManyAction,
          async transform() {
            return;
          },
        },
      ],
    });
    const { changes, failures } = await gen.runActions({ dataProp });

    expect(failures.length > 0).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath1)).toBe(false);
    expect(fs.existsSync(filePath2)).toBe(false);
  });

  test("addMany action async transform returns invalid", async function () {
    const gen = plop.setGenerator("addMany-action", {
      actions: [
        {
          ...addManyAction,
          async transform() {
            return null;
          },
        },
      ],
    });

    const { changes, failures } = await gen.runActions({ dataProp });

    expect(failures.length === 1).toBe(true);
    expect(changes.length === 0).toBe(true);

    expect(fs.existsSync(filePath1)).toBe(false);
    expect(fs.existsSync(filePath2)).toBe(false);
  });
});
