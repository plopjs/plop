const fs = require('fs');
const mock = require('mock-fs');
const test = require('ava').test;
const path = require('path');
const fromRealFs = require('./helpers/mock-fs-helper').duplicateFSInMemory;
const nodePlop = require('../lib/index.js');
const mountFs = require('mountfs');

// patch the fs module with mount/unmount functions
mountFs.patchInPlace();

test.before(function(t) {
	const root = path.resolve(__dirname, '../');
	process.chdir(root);

	var mockedSrc = mock.fs({[`${__dirname}/mock-src/temp`]: {}});
	fs.mount(mockedSrc);
});

test.after(function () {

});

test.cb('test basic add action', t => {

	const plop = nodePlop(`${__dirname}/mock-src/plopfile.js`);
	const basicAdd = plop.getGenerator('basic-add');

	basicAdd.runActions({name: 'this is a test'})
		.then(
			function (successData) {
				t.pass();
			},
			function (failureData) {
				t.fail();
			}
		)
		.finally(t.end);
	// try{
	// 	fs.statSync(`${__dirname}/mock-src/plopfile.js`);
	// 	t.pass();
	// } catch(error) {
	// 	t.fail();
	// }
	// t.end();
});
