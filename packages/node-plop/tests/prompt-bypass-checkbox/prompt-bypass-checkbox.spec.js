import promptBypass from "../../src/prompt-bypass.js";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("prompt-bypass-checkbox", function () {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  const prompts = [
    {
      type: "checkbox",
      name: "checkbox",
      message: "checkboxMsg",
      choices: ["one", { key: "t", value: "two" }, { name: "three" }],
    },
  ];

  test("verify good bypass input", async function () {
    const [, allAnswersByValue] = await promptBypass(
      prompts,
      ["one,two,three"],
      plop,
    );
    expect(Array.isArray(allAnswersByValue.checkbox)).toBe(true);
    expect(JSON.stringify(allAnswersByValue.checkbox)).toBe(
      '["one","two","three"]',
    );

    const [, someAnswersByValue] = await promptBypass(
      prompts,
      ["one,three"],
      plop,
    );
    expect(Array.isArray(someAnswersByValue.checkbox)).toBe(true);
    expect(JSON.stringify(someAnswersByValue.checkbox)).toBe('["one","three"]');

    const [, allAnswersByIndex] = await promptBypass(prompts, ["0,1,2"], plop);
    expect(Array.isArray(allAnswersByIndex.checkbox)).toBe(true);
    expect(JSON.stringify(allAnswersByIndex.checkbox)).toBe(
      '["one","two","three"]',
    );

    const [, someAnswersByIndex] = await promptBypass(prompts, ["0,2"], plop);
    expect(Array.isArray(someAnswersByIndex.checkbox)).toBe(true);
    expect(JSON.stringify(someAnswersByIndex.checkbox)).toBe('["one","three"]');

    const [, allAnswersByMixed] = await promptBypass(
      prompts,
      ["0,t,three"],
      plop,
    );
    expect(Array.isArray(allAnswersByMixed.checkbox)).toBe(true);
    expect(JSON.stringify(allAnswersByMixed.checkbox)).toBe(
      '["one","two","three"]',
    );

    const [, someAnswersByMixed] = await promptBypass(
      prompts,
      ["0,three"],
      plop,
    );
    expect(Array.isArray(someAnswersByMixed.checkbox)).toBe(true);
    expect(JSON.stringify(someAnswersByMixed.checkbox)).toBe('["one","three"]');

    const [, noAnswers] = await promptBypass(prompts, [""], plop);
    expect(Array.isArray(noAnswers.checkbox)).toBe(true);
    expect(JSON.stringify(noAnswers.checkbox)).toBe("[]");
  });

  test("verify bad bypass input", async function () {
    await expect(() =>
      promptBypass(prompts, ["one,four"]).reject.toThrow({ is: plop }),
    );
    await expect(() =>
      promptBypass(prompts, ["four"]).reject.toThrow({ is: plop }),
    );
    await expect(() =>
      promptBypass(prompts, ["3"]).reject.toThrow({ is: plop }),
    );
  });
});
