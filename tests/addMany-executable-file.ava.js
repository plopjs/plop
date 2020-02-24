import fs from 'fs';
import AvaTest from './_base-ava-test';
const { test, mockPath, testSrcPath, nodePlop } = new AvaTest(__filename);

const plop = nodePlop(`${mockPath}/plopfile.js`);
const executableFlagAddMany = plop.getGenerator('executable-flag-add-many');
let res;

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
