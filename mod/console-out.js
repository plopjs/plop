'use strict';

var colors = require('colors');
var inquirer = require('inquirer');
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

	return {
		chooseOptionFromList: chooseOptionFromList
	};
})();
