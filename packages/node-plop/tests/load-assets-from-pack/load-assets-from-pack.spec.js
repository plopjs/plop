import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, mockPath } = setupMockPath(import.meta.url);

describe("load-assets-from-pack", function () {
  afterEach(clean);

  const packModuleName = "plop-pack-fancy-comments";
  const plopfilePath = path.join(mockPath, "plopfile.js");

  /////
  // test the various ways to import all or part of a node module
  //

  test("plop.load should use the default include definition set by the pack", async function () {
    const plop = await nodePlop();
    await plop.load(packModuleName);

    expect(plop.getHelperList().includes("js-multi-line-header")).toBe(true);
    expect(plop.getGeneratorList().length).toBe(0);
    expect(plop.getHelperList().length > 0).toBe(true);
    expect(plop.getPartialList().length).toBe(0);
  });

  test("plop.load should include all generators by default", async function () {
    const plop = await nodePlop();
    await plop.load([packModuleName], { prefix: "html-" });

    expect(plop.getHelperList().includes("html-multi-line-header")).toBe(true);
    expect(plop.getGeneratorList().length).toBe(0);
    expect(plop.getHelperList().length > 0).toBe(true);
    expect(plop.getPartialList().length).toBe(0);
  });

  test("plop.load should work with mixed types (packs and files)", async function () {
    const plop = await nodePlop();
    await plop.load([packModuleName, plopfilePath]);

    expect(plop.getHelperList().includes("js-multi-line-header")).toBe(true);
    expect(plop.getGeneratorList().length).toBe(3);
    expect(plop.getHelperList().length > 0).toBe(true);
    expect(plop.getPartialList().length).toBe(0);
  });

  test("plop.load should allow consumer to override config", async function () {
    const plop = await nodePlop();
    await plop.load([packModuleName, plopfilePath], { prefix: "test-" });

    expect(plop.getHelperList().includes("test-multi-line-header")).toBe(true);
    expect(
      plop
        .getGeneratorList()
        .map((g) => g.name)
        .includes("test-generator1"),
    ).toBe(true);
    expect(plop.getGeneratorList().length).toBe(3);
    expect(plop.getHelperList().length > 0).toBe(true);
    expect(plop.getPartialList().length).toBe(0);
  });

  test("plop.load should allow consumer to override include definition", async function () {
    const plop = await nodePlop();
    await plop.load([packModuleName, plopfilePath], null, { helpers: true });

    expect(plop.getGeneratorList().length).toBe(0);
    expect(plop.getHelperList().length > 0).toBe(true);
    expect(plop.getHelperList().includes("js-multi-line-header")).toBe(true);
    expect(plop.getPartialList().length).toBe(0);
  });
});
