import fs from "fs";
import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";

const { clean, testSrcPath, mockPath } = setupMockPath(import.meta.url);

describe("prepend", function () {
  afterEach(clean);

  let plop;
  let makeList;
  let prependToList;
  let prependWithoutPattern;

  beforeEach(async () => {
    plop = await nodePlop(`${mockPath}/plopfile.js`);
    makeList = plop.getGenerator("make-list");
    prependToList = plop.getGenerator("prepend-to-list");
    prependWithoutPattern = plop.getGenerator("prepend-without-pattern");
  });

  test("Check if list has been created", async function () {
    await makeList.runActions({ listName: "test" });
    const filePath = path.resolve(testSrcPath, "test.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Check if entry will be prepended", async function () {
    await makeList.runActions({ listName: "list1" });
    await prependToList.runActions({
      listName: "list1",
      name: "Marco",
      allowDuplicates: false,
    });
    await prependToList.runActions({
      listName: "list1",
      name: "Polo",
      allowDuplicates: false,
    });
    const filePath = path.resolve(testSrcPath, "list1.txt");
    const content = fs.readFileSync(filePath).toString();

    expect(
      (
        content.match(/name: Marco1\nname: Polo1\n-- PREPEND ITEMS HERE --/g) ||
        []
      ).length,
    ).toBe(1);
    expect(
      (
        content.match(
          /name: Marco2\nname: Polo2\n\/\* PREPEND OTHER ITEMS HERE \*\//g,
        ) || []
      ).length,
    ).toBe(1);
  });

  test("Check if duplicates get filtered", async function () {
    await makeList.runActions({ listName: "list2" });

    await prependToList.runActions({
      listName: "list2",
      name: "Marco",
      allowDuplicates: false,
    });
    await prependToList.runActions({
      listName: "list2",
      name: "Polo",
      allowDuplicates: false,
    });
    await prependToList.runActions({
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

  test("Check if duplicates are kept, if allowed", async function () {
    await makeList.runActions({ listName: "list3" });
    await prependToList.runActions({
      listName: "list3",
      name: "Marco",
      allowDuplicates: true,
    });
    await prependToList.runActions({
      listName: "list3",
      name: "Polo",
      allowDuplicates: true,
    });
    await prependToList.runActions({
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

  test("Check if prepend happen at the top of the file in case of no pattern", async function () {
    await makeList.runActions({ listName: "list4" });

    await prependWithoutPattern.runActions({
      listName: "list4",
      name: "Marco",
      allowDuplicates: true,
    });
    const filePath = path.resolve(testSrcPath, "list4.txt");
    const content = fs.readFileSync(filePath).toString();
    expect(content.match(/name: Marco2\nname: Marco1\nDon't remove me: Plop/g));
  });
});
