export default function (plop) {
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
			path: 'tests/{{dashCase name}}/{{dashCase name}}.spec.js',
			templateFile: 'plop-templates/template-test.js'
		}]
	});
};
