import { rm } from "node:fs/promises";
import * as fspp from "../../src/fs-promise-proxy.js";
import { normalizePath } from "../../src/actions/_common-action-utils.js";

export default async function (data, cfg /*, plop*/) {
  const removeFilePath = cfg.path;
  if (await fspp.fileExists(removeFilePath)) {
    return await rm(normalizePath(removeFilePath), {
      force: true,
      recursive: true,
    });
  } else {
    throw `Path does not exist ${removeFilePath}`;
  }
}
