import path from "path";
import { normalizePath } from "../../src/actions/_common-action-utils.js";
import { deleteAsync } from "del";
import * as fspp from "../../src/fs-promise-proxy.js";
import { fileURLToPath } from "node:url";

/**
 * @param {string} importMetaUrl
 */
export function setupMockPath(importMetaUrl) {
  const __dirname = path.dirname(fileURLToPath(importMetaUrl));
  const mockPath = normalizePath(__dirname);
  const testSrcPath = path.resolve(mockPath, "src");

  async function clean() {
    // remove the src folder
    await deleteAsync([normalizePath(testSrcPath)], { force: true });

    try {
      const mockIsEmpty = (await fspp.readdir(mockPath)).length === 0;
      if (mockIsEmpty) {
        await deleteAsync([mockPath], { force: true });
      }
    } catch (err) {
      // there was no mock directory to remove
    }
  }

  return {
    mockPath,
    testSrcPath,
    clean,
  };
}
