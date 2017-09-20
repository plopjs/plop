import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const { test, mockPath, testSrcPath, nodePlop } = (new AvaTest(__filename));

const plop = nodePlop(`${mockPath}/plopfile.js`);
const dynamicTemplateAddMany = plop.getGenerator('dynamic-template-add-many');
var multipleAddsResult;

test.before(() => {
	return dynamicTemplateAddMany
		.runActions({ name: 'John Doe', kind: 'BarChart' })
		.then(function (res) {
			multipleAddsResult = res;
		});
});

test('Check that all files have been created', t => {
	const expectedFiles = [
		'john-doe-bar-chart/john-doe-bar-ctrl.js',
		'john-doe-bar-chart/john-doe-bar-tmpl.html',
		'john-doe-bar-chart/helpers/john-doe.js'
	];
	expectedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.true(fs.existsSync(filePath), `Can't resolve ${filePath}`);
	});

	t.true(multipleAddsResult.changes[0].path.includes(`${expectedFiles.length} files added`));
});

test('Test the content of the rendered file', t => {
	const filePath = path.resolve(testSrcPath, 'john-doe-bar-chart/john-doe-bar-tmpl.html');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('name: John Doe'));
});
