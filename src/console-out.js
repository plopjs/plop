'use strict';

var chalk = require('chalk');
var nodePlop = require('node-plop');
var fs = require('fs');

module.exports = (function () {

	function chooseOptionFromList(plopList) {
		const plop = nodePlop();
		const generator = plop.setGenerator('choose', {
			prompts: [{
				type: 'list',
				name: 'generator',
				message: '[PLOP]'.blue + ' Please choose a generator.',
				choices: plopList.map(function (p) {
					return {
						name: p.name + chalk.gray(!!p.description ? ' - ' + p.description : ''),
						value: p.name
					};
				})
			}]
		});
		return generator.runPrompts().then(results => results.generator);
	}

	function displayHelpScreen() {
		console.log(
			'\n' +
			'USAGE:\n' +
			'  $ plop\t\tSelect from a list of available generators\n' +
			'  $ plop <name>\t\tRun a generator registered under that name\n' +

			'\n' +
			'OPTIONS:\n' +
			'  -h, --help\t\tShow this help display\n' +
			'  -i, --init\t\tGenerate a basic plopfile.js\n' +
			'  -v, --version\t\tPrint current version\n' +
			'  --plopfile\t\tPath to the plopfile\n' +
			'  --completion\t\tMethod to handle bash/zsh/whatever completions\n' +
			'  --cwd\t\t\tDirectory from which relative paths are calculated against\n' +
			'  --require\t\tString or array of modules to require before running plop\n'
		);
	}

	function createInitPlopfile(cwd, callback){
		var initString = 'module.exports = function (plop) {\n\n' +
			'\tplop.setGenerator(\'basics\', {\n' +
			'\t\tdescription: \'this is a skeleton plopfile\',\n' +
			'\t\tprompts: [],\n' +
			'\t\tactions: []\n' +
			'\t});\n\n' +
			'};';

		fs.writeFile(cwd + '/plopfile.js', initString, callback);
	}

	return {
		chooseOptionFromList: chooseOptionFromList,
		displayHelpScreen: displayHelpScreen,
		createInitPlopfile: createInitPlopfile
	};
})();
