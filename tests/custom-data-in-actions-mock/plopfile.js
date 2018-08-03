module.exports = function (plop) {
	// test with dynamic actions, regarding responses to prompts
	plop.setGenerator('custom-data-in-actions', {
		description: 'A test that shows how to append data in action definitions',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your name?',
			}
		],
		actions:  [
			{
				type: 'add',
				path: 'src/{{name}}-loves-who.txt',
				templateFile: 'plop-templates/who-loves-who.txt',
				data: {
					name: 'Frodo',
					otherName: 'Gandalf'
				}
			}, function (data) {
				data.subject = 'world';
				return 'custom action added data';
			}, {
				type: 'add',
				path: 'src/{{greeting}}-{{subject}}.txt',
				templateFile: 'plop-templates/who-loves-who.txt',
				data: () => ({greeting: 'hola'})
			}
		]
	});
};
