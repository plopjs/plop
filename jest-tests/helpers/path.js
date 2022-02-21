import path from "path";
import {normalizePath} from "../../src/actions/_common-action-utils.js";
import del from "del";
import * as fspp from "../../src/fs-promise-proxy.js";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} testFile
 */
export function setupMockPath(testFile) {
    const testName = path.basename(testFile).split('.')[0];
    const mockPath = normalizePath(path.resolve(__dirname, '..', testName + '-mock'));
    const testSrcPath = path.resolve(mockPath, 'src');

    async function clean() {
        // remove the src folder
        await del([normalizePath(testSrcPath)], {force: true});

        try {
            const mockIsEmpty = (await fspp.readdir(mockPath)).length === 0;
            if (mockIsEmpty) {
                await del([mockPath], {force: true});
            }
        } catch (err) {
            // there was no mock directory to remove
        }
    }

    return {
        testName, mockPath, testSrcPath, clean
    }
}
