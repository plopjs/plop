import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("get-generator-list", function () {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  /////
  // if an action has no path, the action should fail
  //

  test("set generator should return the generator object", function () {
    plop.setGenerator("one", {});
    plop.setGenerator("two", {});
    plop.setGenerator("three", {});

    const list = plop.getGeneratorList().map((g) => g.name);

    expect(list.includes("one")).toBe(true);
    expect(list.includes("two")).toBe(true);
    expect(list.includes("three")).toBe(true);
    expect(list.includes("four")).toBe(false);
  });
});
