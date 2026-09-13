import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("append", function () {
  afterEach(clean);

  let plop;
  let makeList;
  let appendToList;

  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    makeList = plop.getGenerator("make-list");
    appendToList = plop.getGenerator("append-to-list");
  });

  test("Check if list has been created", async function () {
    await makeList.runActions({ listName: "test" });
    const filePath = path.resolve(testSrcPath, "test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Check if entry will be appended", async function () {
    await makeList.runActions({ listName: "list1" });
    await appendToList.runActions({
      listName: "list1",
      name: "Marco",
      allowDuplicates: false,
    });
    await appendToList.runActions({
      listName: "list1",
      name: "Polo",
      allowDuplicates: false,
    });
    const filePath = path.resolve(testSrcPath, "list1.txt");
    const content = fs.readFileSync(filePath).toString();

    expect((content.match(/Marco1/g) || []).length).toBe(1);
    expect((content.match(/Polo1/g) || []).length).toBe(1);
    expect((content.match(/Marco2/g) || []).length).toBe(1);
    expect((content.match(/Polo2/g) || []).length).toBe(1);
  });

  test("Check if duplicates get filtered", async function () {
    await makeList.runActions({ listName: "list2" });

    await appendToList.runActions({
      listName: "list2",
      name: "Marco",
      allowDuplicates: false,
    });
    await appendToList.runActions({
      listName: "list2",
      name: "Polo",
      allowDuplicates: false,
    });
    await appendToList.runActions({
      listName: "list2",
      name: "Marco",
      allowDuplicates: false,
    });
    const filePath = path.resolve(testSrcPath, "list2.txt");
    const content = fs.readFileSync(filePath).toString();

    expect((content.match(/Marco1/g) || []).length).toBe(1);
    expect((content.match(/Polo1/g) || []).length).toBe(1);
    expect((content.match(/Marco2/g) || []).length).toBe(1);
    expect((content.match(/Polo2/g) || []).length).toBe(1);
  });

  test.each([
    {
      name: "square brackets in the template",
      template: '"list": [ "element-list" ];',
      otherEntry: '"other": [];',
    },
    {
      name: "a dot in the template",
      template: "item.js",
      otherEntry: "itemXjs",
    },
    {
      name: "parentheses in the template",
      template: "call()",
      otherEntry: "call",
    },
    {
      name: "a square bracket separator",
      template: "entry",
      otherEntry: "other",
      separator: "[",
    },
  ])(
    "filters literal duplicates with $name",
    async ({ template, otherEntry, separator = "\n" }) => {
      await makeList.runActions({ listName: "literal" });
      const filePath = path.resolve(testSrcPath, "literal.txt");
      const prefix = `${separator}${template}\n-- APPEND ITEMS HERE --`;
      fs.writeFileSync(
        filePath,
        prefix +
          separator +
          otherEntry +
          separator +
          template +
          separator +
          template,
      );

      const generator = plop.setGenerator("append-literal", {
        actions: [
          {
            type: "append",
            path: "src/literal.txt",
            pattern: /-- APPEND ITEMS HERE --/,
            template,
            separator,
          },
        ],
      });

      for (let run = 0; run < 2; run++) {
        const result = await generator.runActions({});
        expect(result.failures).toEqual([]);
        expect(fs.readFileSync(filePath, "utf8")).toBe(
          prefix + separator + template + separator + otherEntry,
        );
      }
    },
  );

  test("Check if duplicates are kept, if allowed", async function () {
    await makeList.runActions({ listName: "list3" });
    await appendToList.runActions({
      listName: "list3",
      name: "Marco",
      allowDuplicates: true,
    });
    await appendToList.runActions({
      listName: "list3",
      name: "Polo",
      allowDuplicates: true,
    });
    await appendToList.runActions({
      listName: "list3",
      name: "Marco",
      allowDuplicates: true,
    });
    const filePath = path.resolve(testSrcPath, "list3.txt");
    const content = fs.readFileSync(filePath).toString();

    expect((content.match(/Marco1/g) || []).length).toBe(2);
    expect((content.match(/Polo1/g) || []).length).toBe(1);
    expect((content.match(/Marco2/g) || []).length).toBe(2);
    expect((content.match(/Polo2/g) || []).length).toBe(1);
  });

  test("Check if duplicates are only removed below the pattern", async function () {
    await makeList.runActions({ listName: "list4" });

    await appendToList.runActions({
      listName: "list4",
      name: "Plop",
      allowDuplicates: false,
    });
    await appendToList.runActions({
      listName: "list4",
      name: "Polo",
      allowDuplicates: false,
    });
    await appendToList.runActions({
      listName: "list4",
      name: "Plop",
      allowDuplicates: false,
    });
    const filePath = path.resolve(testSrcPath, "list4.txt");
    const content = fs.readFileSync(filePath).toString();

    expect((content.match(/Plop1/g) || []).length).toBe(1);
    expect((content.match(/Polo1/g) || []).length).toBe(1);
    expect((content.match(/Plop2/g) || []).length).toBe(1);
    expect((content.match(/Polo2/g) || []).length).toBe(1);

    // there's a plop at the top
    expect((content.match(/Plop/g) || []).length).toBe(3);
  });
});
