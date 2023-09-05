import promptBypass from "../../src/prompt-bypass.js";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("prompt-bypass-validate", function () {
  afterEach(clean);
  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  const prompts = [
    {
      type: "input",
      name: "input",
      message: "inputMsg",
      validate: (value) => (value === "invalid" ? "Is invalid" : true),
    },
    {
      type: "input",
      name: "dependent-input",
      message: "dependent-inputMsg",
    },
  ];

  test("verify valid bypass input", async function () {
    const [, isValid] = await promptBypass(prompts, ["valid"], plop);
    expect(isValid.input).toBe("valid");
  });

  test("verify valid bypass input with access to answers", async function () {
    const promptsCopy = [...prompts];
    promptsCopy[1].validate = (value, answers) => {
      expect(answers.input).toBe("valid");
      return !!value;
    };
    const [, isValid] = await promptBypass(
      promptsCopy,
      ["valid", "also valid"],
      plop,
    );
    expect(isValid.input).toBe("valid");
    expect(isValid["dependent-input"]).toBe("also valid");
  });

  test("verify valid bypass async input with access to answers", async function () {
    const promptsCopy = [...prompts];
    promptsCopy[1].validate = async (value, answers) => {
      expect(answers.input).toBe("valid");
      return !!value;
    };
    const [, isValid] = await promptBypass(
      promptsCopy,
      ["valid", "also valid"],
      plop,
    );
    expect(isValid.input).toBe("valid");
    expect(isValid["dependent-input"]).toBe("also valid");
  });

  test("verify bad bypass input", async function () {
    await expect(() =>
      promptBypass(prompts, ["invalid"], { is: plop }),
    ).rejects.toThrow();
  });
});
