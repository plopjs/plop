import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("set-generator-returns-generator", function () {
  afterEach(clean);
  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  /////
  // if an action has no path, the action should fail
  //

  test("set generator should return the generator object", function () {
    const generator = plop.setGenerator("name", {});

    expect(typeof generator.runPrompts).toBe("function");
    expect(typeof generator.runActions).toBe("function");
    expect(generator.name).toBe("name");
  });

  test("set generator without name should return the generator object", function () {
    const generator = plop.setGenerator("", {});

    expect(typeof generator.runPrompts).toBe("function");
    expect(typeof generator.runActions).toBe("function");
    expect(generator.name.startsWith("generator-")).toBe(true);
  });

  test("set generator with null name should return the generator object", function () {
    const generator = plop.setGenerator(null, {});

    expect(typeof generator.runPrompts).toBe("function");
    expect(typeof generator.runActions).toBe("function");
    expect(generator.name.startsWith("generator-")).toBe(true);
  });
});
