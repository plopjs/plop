import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("invalid-generator-names", function () {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  test("Invalid generator names test", function () {
    plop.setGenerator("test");
    expect(() => plop.getGenerator("error")).toThrowError(
      'Generator "error" does not exist.',
    );
  });
});
