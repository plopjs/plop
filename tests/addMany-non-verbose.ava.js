import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const { test, mockPath, testSrcPath, nodePlop } = (new AvaTest(__filename));

const plop = nodePlop(`${mockPath}/plopfile.js`);
const multipleAdds = plop.getGenerator('multiple-adds');
var multipleAddsResult;

test.before(() => {
	return multipleAdds.runActions({ name: 'John Doe' }).then(function (res) {
		multipleAddsResult = res;
	});
});

test('Check that all files have been created', t => {
	const expectedFiles = [
		'john-doe/add.txt',
		'john-doe/another-add.txt',
		'john-doe/nested-folder/a-nested-add.txt',
		'john-doe/nested-folder/another-nested-add.txt',
		'john-doe/nested-folder/my-name-is-john-doe.txt'
	];
	expectedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.true(fs.existsSync(filePath), `Can't resolve ${filePath}`);
	});

	t.true(multipleAddsResult.changes[0].path == `\u001b[34m${expectedFiles.length} files added\u001b[39m`);
});