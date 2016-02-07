'use strict';

var colors = require('colors');
var inquirer = require('inquirer');
var fs = require('fs');
var q = require('q');

module.exports = (function () {

	function chooseOptionFromList(plopList) {
		var _d = q.defer();

		inquirer.prompt([
			{
				type: 'list',
				name: 'generator',
				message: '[PLOP]'.blue + ' Please choose a generator.',
				choices: plopList.map(function (p) {
					return {
						name: p.name + colors.gray(!!p.description ? ' - ' + p.description : ''),
						value: p.name
					};
				})
			}
		], function (results) {
			_d.resolve(results.generator);
		});

		return _d.promise;
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
			'  -v, --version\t\tPrint current version\n'
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
