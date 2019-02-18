import ava from 'ava';
import path from 'path';
import del from 'del';
import co from 'co';
import * as fspp from '../lib/fs-promise-proxy.js';
import nodePlop from '../lib/index.js';

class AvaTest {

	constructor(testFile) {
		this.testName = path.basename(testFile).split('.')[0];
		this.mockPath = path.resolve(__dirname, this.testName + '-mock');
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
			yield del([ctx.testSrcPath]);

			try {
				const mockIsEmpty = (yield fspp.readdir(ctx.mockPath)).length === 0;
				if (mockIsEmpty) {
					yield del([ctx.mockPath]);
				}
			} catch (err) {
				// there was no mock directory to remove
			}
		});
	}
}

export default AvaTest;
