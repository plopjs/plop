import fs from "fs";
import path from "path";
import { setupMockPath } from "../helpers/path.js";
import { normalizePath } from "../../src/actions/_common-action-utils.js";

const { clean, testSrcPath } = setupMockPath(import.meta.url);

describe("{{sentenceCase name}}", () => {
  const plop = nodePlop();

  /////
  //
  //

  test("{{sentenceCase name}} async test", async function (t) {
    const results = await somethingAsync();
  });

  test("{{sentenceCase name}} test", function (t) {});
});
