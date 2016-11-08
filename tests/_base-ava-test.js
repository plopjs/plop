import ava from 'ava';
import path from 'path';
import del from 'del';
import fs from 'fs';
import nodePlop from '../lib/index.js';

class AvaTest {
	
	constructor(testFile) {
		this.testName = path.basename(testFile).split('.')[0];
		this.mockPath = path.resolve(__dirname, this.testName + '-mock');
		this.testSrcPath = this.mockPath + '/src';
		this.test = ava.test;
		this.nodePlop = nodePlop;

		this.test.before(this.clean.bind(this));
		this.test.after(this.clean.bind(this));
	}

	clean() {
		// remove the src folder
		del.sync(this.testSrcPath);

		// if there were no supporting mock files, remove the full mock directory
		const mockExists = fs.existsSync(this.mockPath);
		const mockIsEmpty = mockExists && fs.readdirSync(this.mockPath).length === 0;
		if (mockExists && mockIsEmpty) {
			del.sync(this.mockPath);
		}
	}
};

export default AvaTest;
