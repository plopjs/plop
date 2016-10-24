const fs = require('fs');
const test = require('ava').test;
const path = require('path');
const del = require('del');
const nodePlop = require('../lib/index.js');
const testSrcPath = `${__dirname}/mock-src/src`;

// clean out the /src dir when done
test.after(() => del.sync(testSrcPath));
test.before(() => process.stdout.write('\u001B[2J\u001B[0;0f'));

test('basic add action', function (t) {
	const plop = nodePlop(`${__dirname}/mock-src/plopfile.js`);
	const basicAdd = plop.getGenerator('basic-add');

	return basicAdd.runActions({name: 'this is a test', age: '21'})

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
		})

		.then(function () {
			const filePath = path.resolve(testSrcPath, 'change-me.txt');
			const content = fs.readFileSync(filePath).toString();

			t.true(content.includes('this is a test: 21'));
			t.true(content.includes('this is prepended! replaced => this-is-a-test: 21'));
		});
});

test('dynamic actions test true', function (t) {
	const plop = nodePlop(`${__dirname}/mock-src/plopfile.js`);
	const dynamicActions = plop.getGenerator('dynamic-actions');

	return dynamicActions.runActions({name: 'potato man', yesPotatoes: true})

		// check that the file has been created
		.then(function () {
			t.true(fs.existsSync(path.resolve(testSrcPath, 'potato-man-burger.txt')));
			t.true(fs.existsSync(path.resolve(testSrcPath, 'potato-man-potatoes.txt')));
		});
});

test('dynamic actions test false', function (t) {
	const plop = nodePlop(`${__dirname}/mock-src/plopfile.js`);
	const dynamicActions = plop.getGenerator('dynamic-actions');

	return dynamicActions.runActions({name: 'potato hater', yesPotatoes: false})

		// check that the file has been created
		.then(function () {
			t.true(fs.existsSync(path.resolve(testSrcPath, 'potato-hater-burger.txt')));
			t.false(fs.existsSync(path.resolve(testSrcPath, 'potato-hater-potatoes.txt')));
		});
});
