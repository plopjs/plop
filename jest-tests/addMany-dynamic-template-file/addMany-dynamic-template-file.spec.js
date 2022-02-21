import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const { test, mockPath, testSrcPath, nodePlop } = (new AvaTest(__filename));


var plop;
var dynamicTemplateAddMany;
var multipleAddsResult;
test.before(async () => {
	plop = await nodePlop(`${mockPath}/plopfile.js`);
	dynamicTemplateAddMany = plop.getGenerator('dynamic-template-add-many');
	multipleAddsResult = await dynamicTemplateAddMany
		.runActions({ name: 'John Doe', kind: 'BarChart' })
});

test('Check that all files have been created', () => {
	const expectedFiles = [
		'john-doe-bar-chart/john-doe-bar-ctrl.js',
		'john-doe-bar-chart/john-doe-bar-tmpl.html',
		'john-doe-bar-chart/helpers/john-doe.js'
	];
	expectedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		expect(fs.existsSync(filePath)).toBe(true);
	});

	expect(
        multipleAddsResult.changes[0].path.includes(`${expectedFiles.length} files added`)
    ).toBe(true);
});

test('Test the content of the rendered file', () => {
	const filePath = path.resolve(testSrcPath, 'john-doe-bar-chart/john-doe-bar-tmpl.html');
	const content = fs.readFileSync(filePath).toString();

	expect(content.includes('name: John Doe')).toBe(true);
});
