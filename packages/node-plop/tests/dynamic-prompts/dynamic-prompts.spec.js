import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, mockPath } = setupMockPath(import.meta.url);

describe("dynamic-prompts", function () {
  afterEach(clean);

  let plop, dynamicPrompts;

  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    dynamicPrompts = plop.getGenerator("dynamic-prompt");
  });

  test("If prompt is provided as a function, runPrompts() should call it", async function () {
    const result = await dynamicPrompts.runPrompts();
    expect(result.promptFunctionCalled).toBe(true);
  });

  test("If prompt is provided as a function, runPrompts() should be called with inquirer instance", async function () {
    const result = await dynamicPrompts.runPrompts();
    expect(result.promptArgs[0]).toBe(plop.inquirer);
  });

  test("Prompt can be a function that synchronously returns answers", async function () {
    const dynPromptSync = plop.setGenerator("dynamic-prompt-sync", {
      prompts: () => ({ promptFunctionCalled: true }),
    });
    const result = await dynPromptSync.runPrompts();
    expect(result.promptFunctionCalled).toBe(true);
  });
});
