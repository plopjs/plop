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
	const runner = generatorRunner(plop);

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
		// node-plop higher level api
		runPrompts: runner.runGeneratorPrompts,
		runActions: runner.runGeneratorActions,

		// enhanced base api
		getGenerator: function (genName) {
			const genObject = plop.getGenerator(genName);
			return Object.assign(genObject, {
				runActions: (data) => runner.runGeneratorActions(genObject, data),
				runPrompts: () => runner.runGeneratorPrompts(genObject)
			});
		},

		// base api pass-through
		setGenerator: plop.setGenerator,
		getGeneratorList: plop.getGeneratorList,
		renderString: plop.renderString,

		setPlopfilePath: plop.setPlopfilePath,
		getPlopfilePath: plop.getPlopfilePath,

		addHelper: plop.addHelper,
		addPartial: plop.addPartial,
		addPrompt: plop.addPrompt,

		inquirer: plop.inquirer,
		handlebars: plop.handlebars,
	};

};
