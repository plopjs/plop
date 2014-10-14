module.exports = (function () {
	'use strict';
	var changeCase = require('change-case'),
		handlebars = require('handlebars');

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
	function renderString(template, data) {
		var t = template,
			h;
		
		for (h in helpers) {
			if (!helpers.hasOwnProperty(h)) { continue; }
			handlebars.registerHelper(h, helpers[h]);
		}

		return handlebars.compile(t)(data);
	}

	function setGenerator(name, config) { generators[name] = config; }
	function getGenerator(name) { return generators[name]; }
	function getGeneratorList() { return Object.keys(generators); }
	
	function setPlopfilePath(path) { plopfilePath = path; }
	function getPlopfilePath() { return plopfilePath; }


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