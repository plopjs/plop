import promptBypass from "../../src/prompt-bypass.js";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("prompt-bypass-list", function () {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  const prompts = [
    {
      type: "list",
      name: "list",
      message: "listMsg",
      choices: [
        "eh",
        { key: "b", value: "bee" },
        { name: "c", value: "see" },
        { value: "d" },
        { name: "e" },
        { key: "f", name: "ff", value: { prop: "value" } },
      ],
    },
  ];

  test("verify good bypass input", async function () {
    const [, byValue] = await promptBypass(prompts, ["eh"], plop);
    expect(byValue.list).toBe("eh");

    const [, byKey] = await promptBypass(prompts, ["b"], plop);
    expect(byKey.list).toBe("bee");

    const [, byName] = await promptBypass(prompts, ["c"], plop);
    expect(byName.list).toBe("see");

    const [, byValueProp] = await promptBypass(prompts, ["d"], plop);
    expect(byValueProp.list).toBe("d");

    const [, byNameNoValue] = await promptBypass(prompts, ["e"], plop);
    expect(byNameNoValue.list).toBe("e");

    const [, byIndexValue] = await promptBypass(prompts, ["0"], plop);
    expect(byIndexValue.list).toBe("eh");

    const [, byIndexKey] = await promptBypass(prompts, ["1"], plop);
    expect(byIndexKey.list).toBe("bee");

    const [, byIndexName] = await promptBypass(prompts, ["2"], plop);
    expect(byIndexName.list).toBe("see");

    const [, byIndexValueProp] = await promptBypass(prompts, ["3"], plop);
    expect(byIndexValueProp.list).toBe("d");

    const [, byIndexNameNoValue] = await promptBypass(prompts, ["4"], plop);
    expect(byIndexNameNoValue.list).toBe("e");

    const [, byIndexNumber] = await promptBypass(prompts, [4], plop);
    expect(byIndexNumber.list).toBe("e");

    const [, byIndexNumberObject] = await promptBypass(prompts, [5], plop);
    expect(byIndexNumberObject.list).toEqual({ prop: "value" });

    const [, byKeyObject] = await promptBypass(prompts, "f", plop);
    expect(byKeyObject.list).toEqual({ prop: "value" });

    const [, byNameObject] = await promptBypass(prompts, "ff", plop);
    expect(byNameObject.list).toEqual({ prop: "value" });
  });

  test("verify bad bypass input", async function () {
    await expect(() =>
      promptBypass(prompts, ["asdf"], { is: plop }),
    ).rejects.toThrow();
    await expect(() =>
      promptBypass(prompts, ["6"], { is: plop }),
    ).rejects.toThrow();
    await expect(() =>
      promptBypass(prompts, [6], { is: plop }),
    ).rejects.toThrow();
  });
});
