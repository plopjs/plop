import path from 'path';
import inquirer from 'inquirer';
import handlebars from 'handlebars';

import bakedInHelpers from './baked-in-helpers';
import generatorRunner from './generator-runner';

function nodePlop(plopfilePath = '', plopCfg = {}) {

	var pkgJson = {};
	var defaultInclude = {generators: true};

	const {destBasePath} = plopCfg;
	const generators = {};
	const partials = {};
	const actionTypes = {};
	const helpers = Object.assign({
		pkg: (key) => pkgJson[key] || ''
	}, bakedInHelpers);
	const baseHelpers = Object.keys(helpers);

	const addPrompt = inquirer.registerPrompt;
	const addHelper = (name, fn) => { helpers[name] = fn; };
	const addPartial = (name, str) => { partials[name] = str; };
	const addActionType = (name, fn) => { actionTypes[name] = fn; };

	function renderString(template, data) {
		Object.keys(helpers).forEach(h => handlebars.registerHelper(h, helpers[h]));
		Object.keys(partials).forEach(p => handlebars.registerPartial(p, partials[p]));
		return handlebars.compile(template)(data);
	}

	const getHelper = name => helpers[name];
	const getPartial = name => partials[name];
	const getActionType = name => actionTypes[name];
	const getGenerator = name => generators[name];
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

	const getHelperList = () => Object.keys(helpers).filter(h => !baseHelpers.includes(h));
	const getPartialList = () => Object.keys(partials);
	const getActionTypeList = () => Object.keys(actionTypes);
	function getGeneratorList() {
		return Object.keys(generators).map(function (name) {
			const {description} = generators[name];
			return {name, description};
		});
	}

	const setDefaultInclude = inc => defaultInclude = inc;
	const getDefaultInclude = () => defaultInclude;
	const getDestBasePath = () => destBasePath || plopfilePath;
	const getPlopfilePath = () => plopfilePath;
	const setPlopfilePath = filePath => plopfilePath = path.dirname(filePath);

	function load(targets, loadCfg = {}, includeOverride) {
		if (typeof targets === 'string') { targets = [targets]; }
		const config = Object.assign({
			destBasePath: getDestBasePath()
		}, loadCfg);

		targets.forEach(function (target) {
			var targetPath;

			try {
				targetPath = require.resolve(target);
			} catch (err) {
				targetPath = path.resolve(getPlopfilePath(), target);
			}

			const proxy = nodePlop(targetPath, config);
			const proxyDefaultInclude = proxy.getDefaultInclude() || {};
			const includeCfg = includeOverride || proxyDefaultInclude;
			const include = Object.assign({
				generators: false,
				helpers: false,
				partials: false,
				actionTypes: false
			}, includeCfg);

			const genNameList = proxy.getGeneratorList().map(g => g.name);
			loadAsset(genNameList, include.generators, setGenerator, proxyName => ({proxyName, proxy}));
			loadAsset(proxy.getPartialList(), include.partials, addPartial, proxy.getPartial);
			loadAsset(proxy.getHelperList(), include.helpers, addHelper, proxy.getHelper);
			loadAsset(proxy.getActionTypeList(), include.actionTypes, addActionType, proxy.getActionType);
		});
	}

	function loadAsset(nameList, include, addFunc, getFunc) {
		var incArr;
		if (include === true) { incArr = nameList; }
		if (include instanceof Array) {
			incArr = include.filter(n => typeof n === 'string');
		}
		if (incArr != null) {
			include = incArr.reduce(function (inc, name) {
				inc[name] = name;
				return inc;
			}, {});
		}

		if (include instanceof Object) {
			Object.keys(include).forEach(i => addFunc(include[i], getFunc(i)));
		}
	}

	// look for a package.json file to use for the "pkg" helper
	try { pkgJson = require(path.join(getDestBasePath(), 'package.json')); }
	catch(error) { pkgJson = {}; }

	/////////
	// the API that is exposed to the plopfile when it is executed
	// it differs from the nodePlopApi in that it does not include the
	// generator runner methods
	//
	const plopfileApi = {
		addHelper, addPartial, addPrompt, addActionType, renderString,
		setGenerator, getGenerator, getGeneratorList,
		setPlopfilePath, getPlopfilePath, getDestBasePath, load,
		setDefaultInclude,
		inquirer, handlebars
	};

	// the runner for this instance of the nodePlop api
	const runner = generatorRunner(plopfileApi, actionTypes);
	const nodePlopApi = Object.assign({}, plopfileApi, {
		getGenerator(name) {
			var generator = plopfileApi.getGenerator(name);

			// if this generator was loaded from an external plopfile, proxy the
			// generator request through to the external plop instance
			if (generator.proxy) {
				return generator.proxy.getGenerator(generator.proxyName);
			}

			return Object.assign({}, generator, {
				runActions: (data) => runner.runGeneratorActions(generator, data),
				runPrompts: () => runner.runGeneratorPrompts(generator)
			});
		},
		setGenerator(name, config) {
			const g = plopfileApi.setGenerator(name, config);
			return this.getGenerator(g.name);
		},
		getPartialList, getPartial,
		getHelperList, getHelper,
		getActionTypeList, getActionType,
		getDefaultInclude
	});

	if (plopfilePath) {
		plopfilePath = path.resolve(plopfilePath);
		const plopFileName = path.basename(plopfilePath);
		setPlopfilePath(plopfilePath);
		require(path.join(plopfilePath, plopFileName))(plopfileApi, plopCfg);
	}

	return nodePlopApi;
}

export default nodePlop;
