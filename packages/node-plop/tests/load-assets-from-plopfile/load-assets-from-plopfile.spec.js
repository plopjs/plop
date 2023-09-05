import path from "path";
import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean, mockPath } = setupMockPath(import.meta.url);

describe("load-assets-from-plopfile", function () {
  afterEach(clean);

  const plopfilePath = path.join(mockPath, "plopfile.js");

  /////
  // test the various ways to import all or part of a plopfile
  //
  test("plop.load should include all generators by default", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath);

    expect(plop.getGeneratorList().length).toBe(3);
    expect(plop.getHelperList().length).toBe(0);
    expect(plop.getPartialList().length).toBe(0);
  });

  test("plop.load should be able to include a subset of generators", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, {}, { generators: ["generator1"] });

    expect(plop.getGeneratorList().length).toBe(1);
    expect(plop.getGeneratorList()[0].name).toBe("generator1");
    expect(plop.getHelperList().length).toBe(0);
    expect(plop.getPartialList().length).toBe(0);
  });

  test("plop.load last in wins", async function () {
    const plop = await nodePlop();

    plop.setGenerator("generator1", { description: "local" });
    expect(plop.getGenerator("generator1").description).toBe("local");

    await plop.load(plopfilePath, {}, { generators: ["generator1"] });

    expect(plop.getGeneratorList().length).toBe(1);
    expect(plop.getGeneratorList()[0].name).toBe("generator1");
    expect(plop.getGenerator("generator1").description).toBe(undefined);
  });

  test("plop.load can rename loaded assets", async function () {
    const plop = await nodePlop();

    plop.setGenerator("generator1", { description: "local" });
    expect(plop.getGenerator("generator1").description).toBe("local");

    await plop.load(
      plopfilePath,
      {},
      {
        generators: {
          generator1: "gen1",
          generator3: "bob",
        },
      },
    );

    const gNameList = plop.getGeneratorList().map((g) => g.name);
    expect(gNameList.length).toBe(3);
    expect(gNameList.includes("generator1")).toBe(true);
    expect(plop.getGenerator("generator1").description).toBe("local");
    expect(gNameList.includes("gen1")).toBe(true);
    expect(plop.getGenerator("gen1").description).toBe(undefined);
    expect(gNameList.includes("bob")).toBe(true);
  });

  test("plop.load passes a config object that can be used to change the plopfile output", async function () {
    const plop = await nodePlop();
    await plop.load(
      plopfilePath,
      { prefix: "test-" },
      {
        generators: true,
        helpers: true,
        partials: true,
        actionTypes: true,
      },
    );

    const gNameList = plop.getGeneratorList().map((g) => g.name);
    expect(gNameList.length).toBe(3);
    expect(plop.getHelperList().length).toBe(3);
    expect(plop.getPartialList().length).toBe(3);
    expect(plop.getActionTypeList().length).toBe(1);
    expect(gNameList.includes("test-generator1")).toBe(true);
    expect(plop.getHelperList().includes("test-helper2")).toBe(true);
    expect(plop.getPartialList().includes("test-partial3")).toBe(true);
    expect(plop.getActionTypeList().includes("test-actionType1")).toBe(true);
  });

  test("plop.load passes a config option that can be used to include all the plopfile output", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, { prefix: "test-" }, true);

    const gNameList = plop.getGeneratorList().map((g) => g.name);
    expect(gNameList.length).toBe(3);
    expect(plop.getHelperList().length).toBe(3);
    expect(plop.getPartialList().length).toBe(3);
    expect(plop.getActionTypeList().length).toBe(1);
    expect(gNameList.includes("test-generator1")).toBe(true);
    expect(plop.getHelperList().includes("test-helper2")).toBe(true);
    expect(plop.getPartialList().includes("test-partial3")).toBe(true);
    expect(plop.getActionTypeList().includes("test-actionType1")).toBe(true);
  });

  test("plop.load should import functioning assets", async function () {
    const plop = await nodePlop();
    await plop.load(
      plopfilePath,
      { prefix: "test-" },
      {
        generators: true,
        helpers: true,
        partials: true,
        actionTypes: true,
      },
    );

    expect(plop.getHelper("test-helper2")("test")).toBe("helper 2: test");
    expect(plop.getPartial("test-partial3")).toBe("partial 3: {{name}}");
    expect(plop.getActionType("test-actionType1")()).toBe("test");
  });

  test("plop.load can include only helpers", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, null, { helpers: true });

    const gNameList = plop.getGeneratorList().map((g) => g.name);
    expect(gNameList.length).toBe(0);
    expect(plop.getHelperList().length).toBe(3);
    expect(plop.getPartialList().length).toBe(0);
  });

  test("plop.load can include only certain helpers", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, null, { helpers: ["helper1"] });
    expect(plop.getHelperList().length).toBe(1);
    expect(plop.getHelperList()[0]).toBe("helper1");
  });

  test("plop.load can include and rename helpers", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, null, { helpers: { helper1: "h1" } });
    expect(plop.getHelperList().length).toBe(1);
    expect(plop.getHelperList()[0]).toBe("h1");
  });

  test("plop.load can include only partials", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, null, { partials: true });

    const gNameList = plop.getGeneratorList().map((g) => g.name);
    expect(gNameList.length).toBe(0);
    expect(plop.getHelperList().length).toBe(0);
    expect(plop.getPartialList().length).toBe(3);
  });

  test("plop.load can include only certain partials", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, null, { partials: ["partial1"] });
    expect(plop.getPartialList().length).toBe(1);
    expect(plop.getPartialList()[0]).toBe("partial1");
  });

  test("plop.load can include and rename partials", async function () {
    const plop = await nodePlop();
    await plop.load(plopfilePath, null, { partials: { partial1: "p1" } });
    expect(plop.getPartialList().length).toBe(1);
    expect(plop.getPartialList()[0]).toBe("p1");
  });
});
