import path from 'path';
import inquirer from 'inquirer';
import handlebars from 'handlebars';
import changeCase from 'change-case';

export default function () {

	var plopfilePath = '';
	var pkgJson = {};

	const generators = {};
	const partials = {};
	const helpers = {
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

	const addPrompt = inquirer.registerPrompt;
	const addHelper = (name, fn) => { helpers[name] = fn; };
	const addPartial = (name, str) => { partials[name] = str; };

	function renderString(template, data) {
		for (let h in helpers) {
			if (!helpers.hasOwnProperty(h)) { continue; }
			handlebars.registerHelper(h, helpers[h]);
		}

		for (let p in partials) {
			if (!partials.hasOwnProperty(p)) { continue; }
			handlebars.registerPartial(p, partials[p]);
		}

		return handlebars.compile(template)(data);
	}

	const getGenerator = (name) => generators[name];
	function setGenerator(name = '', config = {}) {
		// if no name is provided, use a default
		name = name || `generator-${Object.keys(generators).length + 1}`;

		// add the generator to this context
		return generators[name] = Object.assign(config, {
			name: name,
			basePath: plopfilePath
		});
	}
	function getGeneratorList() {
		return Object.keys(generators).map(name => ({
			name,
			description: generators[name].description || ''
		}));
	}

	const getPlopfilePath = () => plopfilePath;
	function setPlopfilePath(filePath) {
		plopfilePath = path.dirname(filePath);

		try {
			pkgJson = require(plopfilePath + '/package.json');
		} catch(err) {}
	}

	/////
	// the plop object API that is exposed to the plopfile when executed
	//
	return {
		addHelper, addPartial, addPrompt, renderString,
		setGenerator, getGenerator, getGeneratorList,
		setPlopfilePath, getPlopfilePath,
		inquirer, handlebars
	};
}
