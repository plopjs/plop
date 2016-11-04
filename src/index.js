import 'core-js'; // es2015 polyfill
import path from 'path';
import plopBase from './modules/plop-base';
import generatorRunner from './modules/generator-runner';

/**
 * Main node-plop module
 *
 * @param {string} plopfilePath - The absolute path to the plopfile we are interested in working with
 * @returns {object} the node-plop API for the plopfile requested
 */
module.exports = function (plopfilePath) {

	const plop = plopBase();
	const {
		getGeneratorList, renderString,
		setPlopfilePath, getPlopfilePath,
		addHelper, addPartial, addPrompt,
		inquirer, handlebars
	} = plop;
	const runner = generatorRunner(plop);

	function getGenerator(name) {
		const generator = plop.getGenerator(name);
		return Object.assign({}, generator, {
			runActions: (data) => runner.runGeneratorActions(generator, data),
			runPrompts: () => runner.runGeneratorPrompts(generator)
		});
	}

	function setGenerator(name, config) {
		plop.setGenerator(name, config);
		return getGenerator(name);
	}

	// run the plopfile setup if a plopfile path was provided
	if (plopfilePath) {
		plopfilePath = path.resolve(plopfilePath);
		plop.setPlopfilePath(plopfilePath);
		require(plopfilePath)(plop);
	}

	/////
	// external API for node-plop
	//
	return {
		// enhanced base api
		getGenerator, setGenerator,

		// base api pass-through
		getGeneratorList, renderString,
		setPlopfilePath, getPlopfilePath,
		addHelper, addPartial, addPrompt,
		inquirer, handlebars
	};

};
