import ava from 'ava';
import path from 'path';
import del from 'del';
import co from 'co';
import * as fspp from '../lib/fs-promise-proxy.js';
import nodePlop from '../lib/index.js';
import { normalizePath } from '../src/actions/_common-action-utils';

class AvaTest {
	constructor(testFile) {
		this.testName = path.basename(testFile).split('.')[0];
		this.mockPath = normalizePath(path.resolve(__dirname, this.testName + '-mock'));
		this.testSrcPath = path.resolve(this.mockPath, 'src');
		this.test = ava;
		this.nodePlop = nodePlop;

		this.test.before(this.clean.bind(this));
		this.test.after(this.clean.bind(this));
	}

	clean() {
		const ctx = this;
		return co(function*() {
			// remove the src folder
			yield del([normalizePath(ctx.testSrcPath)], {force: true});

			try {
				const mockIsEmpty = (yield fspp.readdir(ctx.mockPath)).length === 0;
				if (mockIsEmpty) {
					yield del([ctx.mockPath], {force: true});
				}
			} catch (err) {
				// there was no mock directory to remove
			}
		});
	}
}

export default AvaTest;
