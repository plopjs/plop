module.exports = (function () {
	'use strict';
	var changeCase = require('change-case'),
		// path = require('path'),
		handlebars = require('handlebars');

	// var basePath = '',
	// 	plopFolderName = 'plops',
	// 	plopConfigFileName = 'plop.json',
	var plopfilePath = '',
		generators = {},
		helpers = {
			camelCase: changeCase.camel,
			snakeCase: changeCase.snake,
			dashCase: changeCase.param,
			dotCase: changeCase.dot,
			pathCase: changeCase.path,
			properCase: changeCase.pascalCase
		};


	function addHelper(name, fn) { helpers[name] = fn; }

	function setGenerator(name, config) { generators[name] = config; }
	function getGenerator(name) { return generators[name]; }
	
	function setPlopfilePath(path) { plopfilePath = path; }
	function getPlopfilePath() { return plopfilePath; }

	function getGeneratorList() { return Object.keys(generators); }
	// function setBasePath(p) { basePath = p; }
	// function getBasePath() { return basePath; }

	// function setPlopFolder(pf) { plopFolderName = pf; }
	// function getPlopFolder() { return plopFolderName; }

	// function setPlopConfigFile(filename) { plopConfigFileName = filename; }
	// function getPlopConfigFile(filename) { return plopConfigFileName; }

	// function getPlopFolderPath() { return path.join(basePath, plopFolderName); }

	function renderString(template, data) {
		var t = template,
			h;
		
		for (h in helpers) {
			if (!helpers.hasOwnProperty(h)) { continue; }
			handlebars.registerHelper(h, helpers[h]);
		}

		return handlebars.compile(t)(data);
	}

	return {
		addHelper: addHelper,
		renderString: renderString,
		
		setGenerator: setGenerator,
		getGenerator: getGenerator,
		getGeneratorList: getGeneratorList,

		setPlopfilePath: setPlopfilePath,
		getPlopfilePath: getPlopfilePath
	};
})();