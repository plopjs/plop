import promptBypass from "../../src/prompt-bypass.js";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("prompt-bypass-confirm", function () {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  const prompts = [
    { type: "confirm", name: "confirm1", message: "confirmMsg1" },
    { type: "confirm", name: "confirm2", message: "confirmMsg2" },
    { type: "confirm", name: "confirm3", message: "confirmMsg3" },
    { type: "confirm", name: "confirm4", message: "confirmMsg4" },
  ];

  test("verify good bypass input", async function () {
    const [, isTrue] = await promptBypass(
      prompts,
      ["y", "true", "yes", "t"],
      plop,
    );
    expect(isTrue.confirm1).toBe(true);
    expect(isTrue.confirm2).toBe(true);
    expect(isTrue.confirm3).toBe(true);
    expect(isTrue.confirm4).toBe(true);

    const [, isTrueCap] = await promptBypass(
      prompts,
      ["Y", "True", "YES", "T"],
      plop,
    );
    expect(isTrueCap.confirm1).toBe(true);
    expect(isTrueCap.confirm2).toBe(true);
    expect(isTrueCap.confirm3).toBe(true);
    expect(isTrueCap.confirm4).toBe(true);

    const [, notTrue] = await promptBypass(
      prompts,
      ["n", "false", "no", "n"],
      plop,
    );
    expect(notTrue.confirm1).toBe(false);
    expect(notTrue.confirm2).toBe(false);
    expect(notTrue.confirm3).toBe(false);
    expect(notTrue.confirm4).toBe(false);

    const [, notTrueCap] = await promptBypass(
      prompts,
      ["N", "False", "NO", "N"],
      plop,
    );
    expect(notTrueCap.confirm1).toBe(false);
    expect(notTrueCap.confirm2).toBe(false);
    expect(notTrueCap.confirm3).toBe(false);
    expect(notTrueCap.confirm4).toBe(false);
  });

  test("verify bad bypass input", async function () {
    await expect(() =>
      promptBypass([prompts[0]], ["asdf"], { is: plop }),
    ).rejects.toThrow();
    await expect(() =>
      promptBypass([prompts[0]], ["1"], { is: plop }),
    ).rejects.toThrow();
    await expect(() =>
      promptBypass([prompts[0]], ["0"], { is: plop }),
    ).rejects.toThrow();
    await expect(() =>
      promptBypass([prompts[0]], ["no way"], { is: plop }),
    ).rejects.toThrow();
    await expect(() =>
      promptBypass([prompts[0]], ["NOOOOOO"], { is: plop }),
    ).rejects.toThrow();
  });
});
