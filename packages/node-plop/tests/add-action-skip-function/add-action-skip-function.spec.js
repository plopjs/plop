import fs from "fs";
import path from "path";

import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("add-action-skip-function", function () {
  afterEach(clean);

  let plop;
  beforeAll(async () => {
    plop = await nodePlop();
  });

  const genName = "add-action";
  const fileName = "fileName";

  const addAction = {
    type: "add",
    template: "{{name}}",
    path: `${testSrcPath}/{{name}}.txt`,
  };

  test("action runs as expected without skip function", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [addAction],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length === 1).toBeTruthy();
    expect(results.changes[0].type).not.toBe("skip");
    expect(results.failures.length === 0).toBeTruthy();

    // Check that the file was not created
    expect(fs.existsSync(filePath)).toBeTruthy();
  });

  test("action throws if action.skip is not a function", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          skip: true,
        },
      ],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length === 0).toBeTruthy();
    expect(results.failures.length > 0).toBeTruthy();

    // Check that the file was not created
    expect(fs.existsSync(filePath)).toBeFalsy();
  });

  test("skip function receives correct arguments", async function () {
    const mainData = { fileName, a: 1 };
    const configData = { a: "a", b: 2 };

    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          async skip(...args) {
            expect(args.length).toBe(1);
            // Main data should be overwritten by config data
            expect(args[0]).toEqual({ ...mainData, ...configData });

            return "Just checking arguments";
          },
          data: configData,
        },
      ],
    });

    await action.runActions(mainData);
  });

  test("action executes if async skip function resolves void", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          async skip() {
            return;
          },
        },
      ],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length > 0).toBeTruthy();
    expect(results.failures.length === 0).toBeTruthy();

    // Check that the file was created
    expect(fs.existsSync(filePath)).toBeTruthy();
  });

  test("action executes if skip function returns void", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          skip() {
            return;
          },
        },
      ],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length > 0).toBeTruthy();
    expect(results.changes[0].type).not.toBe("skip");
    expect(results.failures.length === 0).toBeTruthy();

    // Check that the file was created
    expect(fs.existsSync(filePath)).toBeTruthy();
  });

  test("action skips if async skip function returns a string", async function () {
    const message = "We should skip this one!";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          async skip() {
            return message;
          },
        },
      ],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length > 0).toBeTruthy();
    expect(results.changes[0].type).toBe("skip");
    expect(results.changes[0].path === message).toBeTruthy();
    expect(results.failures.length === 0).toBeTruthy();

    // Check that the file was not created
    expect(fs.existsSync(filePath)).toBeFalsy();
  });

  test("action skips if async skip function rejects", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          async skip() {
            throw new Error("Whoops");
          },
        },
      ],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length === 0).toBeTruthy();
    expect(results.failures.length > 0).toBeTruthy();

    // Check that the file was not created
    expect(fs.existsSync(filePath)).toBeFalsy();
  });

  test("action skips if skip function returns a string", async function () {
    const message = "We should skip this one!";
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          skip() {
            return message;
          },
        },
      ],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length > 0).toBeTruthy();
    expect(results.changes[0].type).toBe("skip");
    expect(results.changes[0].path === message).toBeTruthy();
    expect(results.failures.length === 0).toBeTruthy();

    // Check that the file was not created
    expect(fs.existsSync(filePath)).toBeFalsy();
  });

  test("action skips if skip function throws", async function () {
    const filePath = path.resolve(testSrcPath, fileName + ".txt");
    const action = plop.setGenerator(genName, {
      actions: [
        {
          ...addAction,
          skip() {
            throw new Error("Whoops");
          },
        },
      ],
    });

    const results = await action.runActions({ name: fileName });

    // Check action ran ok
    expect(results.changes.length === 0).toBeTruthy();
    expect(results.failures.length > 0).toBeTruthy();

    // Check that the file was not created
    expect(fs.existsSync(filePath)).toBeFalsy();
  });
});
