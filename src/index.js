require('core-js'); // es2015 polyfill
var path = require('path');
var plopBase = require('./modules/plop-base');
var generatorRunner = require('./modules/generator-runner');

/**
 * Main node-plop module
 *
 * @param {string} plopfilePath - The absolute path to the plopfile we are interested in working with
 * @returns {object} the node-plop API for the plopfile requested
 */
module.exports = function (plopfilePath) {

	const plop = plopBase();
	const runner = generatorRunner(plop);

	plopfilePath = path.resolve(plopfilePath);

	plop.setPlopfilePath(plopfilePath);
	require(plopfilePath)(plop);

	/////
	// external API for node-plop
	//
	return {
		getGeneratorList: plop.getGeneratorList,
		getGenerator: function (genName) {
			const genObject = plop.getGenerator(genName);
			return Object.assign(genObject, {
				runActions: (data) => runner.runGeneratorActions(genObject, data),
				runPrompts: () => runner.runGeneratorPrompts(genObject)
			});
		},
		runActions: runner.runGeneratorActions,
		runPrompts: runner.runGeneratorPrompts
	};

};
