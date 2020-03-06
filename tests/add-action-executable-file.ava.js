import fs from 'fs';
import AvaTest from './_base-ava-test';
const { test, mockPath, testSrcPath, nodePlop } = new AvaTest(__filename);

const plop = nodePlop();

if (process.platform !== 'win32') {
	test(
		'Add action keeps the executable flag',
		async function (t) {
			plop.setGenerator('addExecutable', {
				actions: [
					{
						type: 'add',
						path: `${testSrcPath}/added.sh`,
						templateFile: `${mockPath}/plop-templates/add.sh`
					}
				]
			});

			await plop.getGenerator('addExecutable').runActions();
			const destStats = fs.statSync(`${testSrcPath}/added.sh`);
			t.is(destStats.mode & fs.constants.S_IXUSR, fs.constants.S_IXUSR);
		}
	);
} else {
	test.skip(
		'[Windows] Add action keeps the executable flag',
		async function (t) {
			plop.setGenerator('addExecutable', {
				actions: [
					{
						type: 'add',
						path: `${testSrcPath}/added.sh`,
						templateFile: `${mockPath}/plop-templates/add.sh`
					}
				]
			});

			await plop.getGenerator('addExecutable').runActions();
			
			const destStats = fs.statSync(`${testSrcPath}/added.sh`);
			t.is(destStats.mode & fs.constants.S_IXUSR, fs.constants.S_IXUSR);
		}
	);
}
