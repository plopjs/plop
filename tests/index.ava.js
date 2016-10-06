const fs = require('fs');
const test = require('ava').test;
const path = require('path');
const del = require('del');
const nodePlop = require('../lib/index.js');
const testSrcPath = `${__dirname}/mock-src/src`;

// clean out the /src dir when done
test.after(() => del.sync(testSrcPath));

test('basic add action', function (t) {
	const plop = nodePlop(`${__dirname}/mock-src/plopfile.js`);
	const basicAdd = plop.getGenerator('basic-add');

	return basicAdd.runActions({name: 'this is a test'})

		// check that the file has been created
		.then(function () {
			t.true(fs.existsSync(path.resolve(testSrcPath, 'this-is-a-test.txt')));
		})

		// test the content of the rendered file
		.then(function () {
			const filePath = path.resolve(testSrcPath, 'this-is-a-test.txt');
			const content = fs.readFileSync(filePath).toString();

			t.true(content.includes('name: this is a test'));
			t.true(content.includes('upperCase: THIS_IS_A_TEST'));
		})

		// test the content of the rendered file
		.then(function () {
			const filePath = path.resolve(testSrcPath, '_THIS_IS_A_TEST.txt');
			const content = fs.readFileSync(filePath).toString();

			t.true(content.includes('inline template: this is a test'));
		});
});
