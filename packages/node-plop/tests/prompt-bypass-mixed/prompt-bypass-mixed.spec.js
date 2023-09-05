import promptBypass from "../../src/prompt-bypass.js";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("prompt-bypass-mixed", function () {
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
      choices: ["a", "B", "c"],
    },
    { type: "input", name: "input", message: "inputMsg" },
    {
      type: "input",
      name: "filter",
      message: "filterMsg",
      filter: () => "filter applied",
    },
    {
      type: "input",
      name: "filter2",
      message: "filterMsg2",
      filter: () => "t needed",
    },
    {
      type: "input",
      name: "conditional",
      message: "conditionalMsg",
      when: () => false,
    },
  ];

  test("verify good bypass input", async function () {
    const [promptsAfterBypassOne, bypassOne] = await promptBypass(
      prompts,
      ["0"],
      plop,
    );
    expect(bypassOne.list).toBe("a");
    expect(promptsAfterBypassOne.length).toBe(5);
    expect(promptsAfterBypassOne[0].type).toBe(undefined);

    const [promptsAfterBypassTwo, bypassTwo] = await promptBypass(
      prompts,
      ["b", "something"],
      plop,
    );
    expect(bypassTwo.list).toBe("B");
    expect(bypassTwo.input).toBe("something");
    expect(promptsAfterBypassTwo.length).toBe(4);

    const [promptsAfterBypassThree, bypassThree] = await promptBypass(
      prompts,
      ["b", "something", "something filtered"],
      plop,
    );
    expect(bypassThree.list).toBe("B");
    expect(bypassThree.input).toBe("something");
    expect(bypassThree.filter).toBe("filter applied");
    expect(promptsAfterBypassThree.length).toBe(3);

    //check correct parameters passed to inquirer function
    prompts[3].filter = (input, answers) => {
      expect(input).toBe("unimportant");
      expect(answers.list).toBe("B");
      expect(answers.input).toBe("something");
      expect(answers.filter).toBe("filter applied");
      return answers.list;
    };
    const [promptsAfterBypassFour, bypassFour] = await promptBypass(
      prompts,
      ["b", "something", "something filtered", "unimportant"],
      plop,
    );
    expect(bypassFour.list).toBe("B");
    expect(bypassFour.input).toBe("something");
    expect(bypassFour.filter).toBe("filter applied");
    expect(bypassFour.filter2).toBe("B");
    expect(promptsAfterBypassFour.length).toBe(2);
  });

  test("verify bad bypass input", async function () {
    // can't bypass conditional prompts
    await expect(() =>
      promptBypass(
        prompts,
        [
          "a",
          "something",
          "something filtered",
          "unimportant",
          "something else",
        ],
        { is: plop },
      ),
    ).rejects.toThrow();
  });
});
