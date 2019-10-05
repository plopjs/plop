module.exports = function (plop) {
	plop.setGenerator('test', {
		actions: [{
			type: 'add',
			path: '../src/test.txt',
			template: 'test content',
			force: true
		}]
	});
};
