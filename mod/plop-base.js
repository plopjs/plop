module.exports = (function () {
	'use strict';
	var changeCase = require('change-case'),
		path = require('path'),
		handlebars = require('handlebars');

	var basePath = '',
		plopFolderName = 'plops',
		helpers = {
			camelCase: changeCase.camel,
			snakeCase: changeCase.snake,
			dashCase: changeCase.param,
			dotCase: changeCase.dot,
			pathCase: changeCase.path,
			properCase: changeCase.pascalCase
		};


	function addHelper(name, fn) { helpers[name] = fn; }
	function setBasePath(p) { basePath = p; }
	function setPlopFolder(pf) { plopFolderName = pf; }
	function getPlopFolder() { return plopFolderName; }

	function getPlopFolderPath() { return path.join(basePath, plopFolderName); }

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
		renderString: renderString,
		helpers: helpers,
		setBasePath: setBasePath,
		setPlopFolder: setPlopFolder,
		getPlopFolder: getPlopFolder,
		getPlopFolderPath: getPlopFolderPath,
		addHelper: addHelper
	};
})();