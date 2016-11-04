module.exports = function (plop) {
	plop.setGenerator('test', {
		prompts: [{
			type: 'input',
			name: 'name',
			message: function () {return 'test name';},
			validate: function (value) {
				if ((/.+/).test(value)) { return true; }
				return 'test name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'tests/{{dashCase name}}.ava.js',
			templateFile: 'plop-templates/ava-test.js'
		}]
	});
};
