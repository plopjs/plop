import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("missing-action-path", function () {
  afterEach(clean);

  let plop;
  beforeAll(async () => {
    plop = await nodePlop();
  });

  beforeEach(() => {
    plop.setGenerator("no-path", {
      actions: [
        { type: "add", template: "{{name}}", abortOnFail: false },
        { type: "add", path: "", template: "{{name}}" },
      ],
    });
  });

  test("Check that the file has been created", async function () {
    const name = "no path";
    const results = await plop.getGenerator("no-path").runActions({ name });
    const { changes, failures } = results;

    expect(changes.length).toBe(0);
    expect(failures.length).toBe(2);
    expect(failures[0].error).toBe('Invalid path "undefined"');
    expect(failures[1].error).toBe('Invalid path ""');
  });
});
