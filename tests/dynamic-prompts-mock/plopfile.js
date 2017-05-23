module.exports = function (plop) {
	// test with dynamic actions, regarding responses to prompts
	plop.setGenerator('dynamic-prompt', {
		description: 'A test using a dynamic prompt defined by a function',
		prompts: function() {
			return Promise.resolve({
				promptArgs: arguments,
				promptFunctionCalled: true
			});
		},
		actions: function() {
			return [];
		}
	});
};
