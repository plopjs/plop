const fs = require('fs');
const path = require('path');
const nodePlop = require('../lib/index.js');
const mockPath = path.resolve(__dirname, 'mock');
const testSrcPath = `${mockPath}/src`;

const plop = nodePlop(`${mockPath}/plopfile.js`);

module.exports = {
	yesPotatoes: function (t) {
		const dynamicActions = plop.getGenerator('dynamic-actions');

		return dynamicActions.runActions({name: 'potato man', yesPotatoes: true})
			// check that the file has been created
			.then(function () {
				t.true(fs.existsSync(path.resolve(testSrcPath, 'potato-man-burger.txt')));
				t.true(fs.existsSync(path.resolve(testSrcPath, 'potato-man-potatoes.txt')));
			});
	},
	noPotatoes: function (t) {
		const dynamicActions = plop.getGenerator('dynamic-actions');

		return dynamicActions.runActions({name: 'potato hater', yesPotatoes: false})
			// check that the file has been created
			.then(function () {
				t.true(fs.existsSync(path.resolve(testSrcPath, 'potato-hater-burger.txt')));
				t.false(fs.existsSync(path.resolve(testSrcPath, 'potato-hater-potatoes.txt')));
			});
	}
};
