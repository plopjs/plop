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

	t.true(multipleAddsResult.changes[0].path.includes(`${expectedFiles.length} files added`));
});

test('Check that all files have been when using a templateFiles array', t => {
	const expectedFiles = [
		'array-john-doe/add.txt',
		'array-john-doe/another-add.txt',
		'array-john-doe/nested-folder/a-nested-add.txt',
		'array-john-doe/nested-folder/another-nested-add.txt',
		'array-john-doe/nested-folder/my-name-is-john-doe.txt'
	];
	expectedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.true(fs.existsSync(filePath), `Can't resolve ${filePath}`);
	});

	t.true(multipleAddsResult.changes[0].path.includes(`${expectedFiles.length} files added`));
});

test('Check that the base path is chopped from templateFiles path', t => {
	const expectedFiles = [
		'base-john-doe/a-nested-add.txt',
		'base-john-doe/another-nested-add.txt',
		'base-john-doe/my-name-is-john-doe.txt'
	];
	expectedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.true(fs.existsSync(filePath), `Can't resolve ${filePath}`);
	});

	const expectedNotCreatedFiles = [
		'base-john-doe/add.txt',
		'base-john-doe/another-add.txt',
		'base-john-doe/plop-templates/add.txt',
		'base-john-doe/plop-templates/another-add.txt',
	];
	expectedNotCreatedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.false(fs.existsSync(filePath), `Shouldn't resolve ${filePath}`);
	});
});

test('Test the content of the rendered file add.txt', t => {
	const filePath = path.resolve(testSrcPath, 'john-doe/add.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('name: John Doe'));
});

test('Test the content of the rendered file in nested folder', t => {
	const filePath = path.resolve(testSrcPath, 'john-doe/nested-folder/a-nested-add.txt');
	const content = fs.readFileSync(filePath).toString();

	t.true(content.includes('constant name: JOHN_DOE'));
});

test('Test the base value is used to decide which files are created', t => {
	const expectedCreatedFiles = [
		'components/john-doe-ctrl.js',
		'components/john-doe-tmpl.html',
		'components/john-doe-plop-logo.png'
	];
	expectedCreatedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.true(fs.existsSync(filePath), `Can't resolve ${filePath}`);
	});

	const expectedNotCreatedFiles = [
		'components/logic/john-doe-ctrl.js',
		'components/logic/john-doe-tmpl.html',
		'components/tests/john-doe.spec.js',
		'components/john-doe.spec.js'
	];
	expectedNotCreatedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.false(fs.existsSync(filePath), `Shouldn't resolve ${filePath}`);
	});
});

test('Check that all files including dot have been created', t => {
	const expectedFiles = [
		'john-doe-dot/.gitignore',
		'john-doe-dot/add.txt',
		'john-doe-dot/another-add.txt'
	];
	expectedFiles.map((file) => {
		const filePath = path.resolve(testSrcPath, file);
		t.true(fs.existsSync(filePath), `Can't resolve ${filePath}`);
	});
	t.true(multipleAddsResult.changes[4].path.includes(`${expectedFiles.length} files added`));
});
