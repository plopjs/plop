import fs from 'fs';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const { test, mockPath, testSrcPath, nodePlop } = new AvaTest(__filename);

var plop;
var executableFlagAddMany;
let res;
test.before(async () => {
	plop = await nodePlop(`${mockPath}/plopfile.js`);
	executableFlagAddMany = plop.getGenerator('executable-flag-add-many');
});

test.before(() => {
	res = executableFlagAddMany.runActions({ executableName: 'ls command' });
	return res;
});
if (process.platform !== 'win32') {
	test('addMany action keeps the executable flag', t => {
		const destStats = fs.statSync(`${testSrcPath}/ls-command.sh`);
		t.is(destStats.mode & fs.constants.S_IXUSR, fs.constants.S_IXUSR);
	});
} else {
	test.skip('[windows] addMany action keeps the executable flag', (t) => {
		const destStats = fs.statSync(`${testSrcPath}/ls-command.sh`);
		t.is(destStats.mode & fs.constants.S_IXUSR, fs.constants.S_IXUSR);
	});
}
