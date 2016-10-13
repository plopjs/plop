'use strict';

module.exports = (plop) => {

	// test with dynamic actions, regarding responses to prompts
	plop.setGenerator('dynamic actions', {
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
				name: 'hasPotatoes',
				message: 'Do you want potatoes with your burger?'
			}
		],
		actions: function(data) {
			var actions = [
				{
					type: 'add',
					path: 'folder/{{dashCase name}}-burger.txt',
					templateFile: 'templates/burger.txt',
					abortOnFail: true
				}
			];

			if(data.hasPotatoes) {
				actions = actions.concat([
					{
						type: 'add',
						path: 'folder/{{dashCase name}}-potatoes.txt',
						templateFile: 'templates/potatoes.txt',
						abortOnFail: true
					},{
						type: 'modify',
						path: 'folder/{{dashCase name}}-burger.txt',
						pattern: /(!\n)/gi,
						template: '$1Your potatoes: {{dashCase name}}-potatoes.txt'
					}
				]);
			}

			return actions;
		}
	});

};
