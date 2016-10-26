const fs = require('fs');
const path = require('path');
const nodePlop = require('../lib/index.js');
const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src`;

module.exports = function (t) {
	const plop = nodePlop(`${mockPath}/plopfile.js`);
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
};
