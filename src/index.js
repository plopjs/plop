import 'core-js'; // es2015 polyfill
import nodePlop from './modules/plop-base';

/**
 * Main node-plop module
 *
 * @param {string} plopfilePath - The absolute path to the plopfile we are interested in working with
 * @returns {object} the node-plop API for the plopfile requested
 */
module.exports = nodePlop;
