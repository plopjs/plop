module.exports = function (plop) {
	// test with dynamic actions, regarding responses to prompts
	plop.setGenerator('dynamic-actions', {
		description: 'another test using an actions function',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your name?',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'name is required';
				}
			}, {
				type: 'confirm',
				name: 'yesPotatoes',
				message: 'Do you want potatoes with your burger?'
			}
		],
		actions: function(data) {
			var actions = [
				{
					type: 'add',
					path: 'src/{{dashCase name}}-burger.txt',
					templateFile: 'plop-templates/burger.txt',
					abortOnFail: true
				}
			];

			if(data.yesPotatoes) {
				actions.push({
					type: 'add',
					path: 'src/{{dashCase name}}-potatoes.txt',
					templateFile: 'plop-templates/potatoes.txt',
					abortOnFail: true
				});
			}

			return actions;
		}
	});
};
