import path from 'path';
import inquirer from 'inquirer';
import handlebars from 'handlebars';

import bakedInHelpers from './baked-in-helpers';
import generatorRunner from './generator-runner';

function plopBase(plopfilePath = '', plopCfg = {}) {

	var pkgJson = {};

	const {destBasePath} = plopCfg;
	const generators = {};
	const partials = {};
	const helpers = Object.assign({
		pkg: function (key) { return pkgJson[key] || ''; },
		cfg: function (key) { return plopCfg[key] || ''; }
	}, bakedInHelpers);

	const addPrompt = inquirer.registerPrompt;
	const addHelper = (name, fn) => { helpers[name] = fn; };
	const addPartial = (name, str) => { partials[name] = str; };

	function renderString(template, data) {
		Object.keys(helpers).forEach(h => handlebars.registerHelper(h, helpers[h]));
		Object.keys(partials).forEach(p => handlebars.registerPartial(p, partials[p]));
		return handlebars.compile(template)(data);
	}

	const getGenerator = (name) => generators[name];
	function setGenerator(name = '', config = {}) {
		// if no name is provided, use a default
		name = name || `generator-${Object.keys(generators).length + 1}`;

		// add the generator to this context
		generators[name] = Object.assign(config, {
			name: name,
			basePath: plopfilePath
		});

		return generators[name];
	}
	function getGeneratorList() {
		return Object.keys(generators).map(function (name) {
			const {description} = generators[name];
			return {name, description};
		});
	}

	const getDestBasePath = () => destBasePath || plopfilePath;
	const getPlopfilePath = () => plopfilePath;
	const setPlopfilePath = filePath => plopfilePath = path.dirname(filePath);

	function load(files, loadCfg = {}, includeCfg = {}) {
		const config = Object.assign({
			destBasePath: getDestBasePath()
		}, loadCfg);
		const include = Object.assign({
			generators: true,
			helpers: false,
			prompts: false,
			partials: false
		}, includeCfg);

		const proxy = plopBase(path.resolve(getPlopfilePath(), files), config);

		if (include.generators) {
			proxy.getGeneratorList().forEach(g => setGenerator(g.name, {proxy}));
		}
	}

	// look for a package.json file to use for the "pkg" helper
	try { pkgJson = require(`${getDestBasePath()}/package.json`); }
	catch(error) { pkgJson = {}; }

	/////////
	// the plop object API that is exposed to the plopfile when executed
	// it differs from the nodePlopApi in that it does not include the
	// generator runner methods
	//
	const plopApi = {
		addHelper, addPartial, addPrompt, renderString,
		setGenerator, getGenerator, getGeneratorList,
		setPlopfilePath, getPlopfilePath, getDestBasePath, load,
		inquirer, handlebars
	};

	// the runner for this instance of the nodePlop api
	const runner = generatorRunner(plopApi);
	const nodePlopApi = Object.assign({}, plopApi, {
		getGenerator(name) {
			var generator = plopApi.getGenerator(name);

			// if this generator was loaded from an external plopfile, proxy the
			// generator request through to the external plop instance
			if (generator.proxy) { return generator.proxy.getGenerator(name); }

			return Object.assign({}, generator, {
				runActions: (data) => runner.runGeneratorActions(generator, data),
				runPrompts: () => runner.runGeneratorPrompts(generator)
			});
		},
		setGenerator(name, config) {
			const g = plopApi.setGenerator(name, config);
			return this.getGenerator(g.name);
		}
	});

	if (plopfilePath) {
		plopfilePath = path.resolve(plopfilePath);
		const plopFileName = path.posix.basename(plopfilePath);
		setPlopfilePath(plopfilePath);
		require(path.resolve(plopfilePath, plopFileName))(plopApi);
	}

	return nodePlopApi;
}

export default plopBase;
