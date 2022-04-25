import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("get-generator-list", function () {
  afterEach(clean);

  let plop;
  beforeEach(async () => {
    plop = await nodePlop();
  });

  test("custom actions show in the list", function () {
    plop.setActionType("foo", () => {});

    const list = plop.getActionTypeList();

    expect(list.includes("foo")).toBe(true);
  });

  test("custom actions show in the list", function () {
    const list = plop.getActionTypeList();

    expect(list.includes("add")).toBe(true);
    expect(list.includes("modify")).toBe(true);
    expect(list.includes("addMany")).toBe(true);
    expect(list.includes("append")).toBe(true);
  });
});
