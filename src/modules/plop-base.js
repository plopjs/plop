'use strict';

var path = require('path');

module.exports = function () {
	var inquirer = require('inquirer');
	var handlebars = require('handlebars');
	var changeCase = require('change-case');

	var plopfilePath = '';
	var generators = {};
	var pkgJson = {};
	var partials = {};
	var helpers = {
			camelCase: changeCase.camel,
			snakeCase: changeCase.snake,
			dashCase: changeCase.param,
			kabobCase: changeCase.param,
			dotCase: changeCase.dot,
			pathCase: changeCase.path,
			properCase: changeCase.pascal,
			pascalCase: changeCase.pascal,
			lowerCase: changeCase.lower,
			sentenceCase: changeCase.sentence,
			constantCase: changeCase.constant,
			titleCase: changeCase.title,
			pkg: function (key) { return pkgJson[key]; }
		};

	var addPrompt = inquirer.registerPrompt;

	function addHelper(name, fn) { helpers[name] = fn; }
	function addPartial(name, str) { partials[name] = str; }

	function renderString(template, data) {
		var t = template,
			h, p;

		for (h in helpers) {
			if (!helpers.hasOwnProperty(h)) { continue; }
			handlebars.registerHelper(h, helpers[h]);
		}

		for (p in partials) {
			if (!partials.hasOwnProperty(p)) { continue; }
			handlebars.registerPartial(p, partials[p]);
		}

		return handlebars.compile(t)(data);
	}

	function setGenerator(name, config) {
		generators[name] = Object.assign(config, {
			name: name,
			basePath: plopfilePath
		});
	}
	function getGenerator(name) { return generators[name]; }
	function getGeneratorList() {
		return Object.keys(generators).map(function (gName) {
			return {
				name: gName,
				description: generators[gName].description || ''
			};
		});
	}

	function setPlopfilePath(filePath) {
		filePath = path.dirname(filePath);

		try{
			pkgJson = require(filePath + '/package.json');
		} catch(err) {}

		plopfilePath = filePath;
	}
	function getPlopfilePath() { return plopfilePath; }

	/////
	// the plop object API that is exposed to the plopfile when executed
	//
	return {
		addHelper: addHelper,
		addPartial: addPartial,
		addPrompt: addPrompt,
		renderString: renderString,

		setGenerator: setGenerator,
		getGenerator: getGenerator,
		getGeneratorList: getGeneratorList,

		setPlopfilePath: setPlopfilePath,
		getPlopfilePath: getPlopfilePath,

		inquirer: inquirer,
		handlebars: handlebars
	};
};
