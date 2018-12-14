#!/usr/bin/env node

'use strict';

const Liftoff = require('liftoff');
const args = process.argv.slice(2);
const minimist = require('minimist');
const argv = minimist(args);
const v8flags = require('v8flags');
const interpret = require('interpret');
const chalk = require('chalk');
const ora = require('ora');

const nodePlop = require('node-plop');
const out = require('./console-out');
const globalPkg = require('../package.json');

const Plop = new Liftoff({
	name: 'plop',
	extensions: interpret.jsVariants,
	v8flags: v8flags
});

Plop.launch({
	cwd: argv.cwd,
	configPath: argv.plopfile,
	require: argv.require,
	completion: argv.completion
}, run);

function run(env) {
	// Make sure that we're not overwritting `help`, `init,` or `version` args in generators
	if (argv._.length === 0) {
		// handle request for usage and options
		if (argv.help || argv.h) {
			out.displayHelpScreen();
			process.exit(0);
		}

		// handle request for initializing a new plopfile
		if (argv.init || argv.i) {
			return out.createInitPlopfile(env.cwd, function (err) {
				if (err) {
					console.log(err);
					process.exit(1);
				}
				process.exit(0);
			});
		}

		// handle request for version number
		if (argv.version || argv.v) {
			if (env.modulePackage.version !== globalPkg.version) {
				console.log(chalk.yellow('CLI version'), globalPkg.version);
				console.log(chalk.yellow('Local version'), env.modulePackage.version);
			} else {
				console.log(globalPkg.version);
			}
			return;
		}
	}

	const plopfilePath = env.configPath;

	// abort if there's no plopfile found
	if (plopfilePath == null) {
		console.error(chalk.red('[PLOP] ') + 'No plopfile found');
		out.displayHelpScreen();
		process.exit(1);
	}

	// See if there are args to pass to generator
	const eoaIndex = args.indexOf('--');
	const {plopArgV, eoaArg} = eoaIndex === -1 ? {plopArgV: []} : {
		plopArgV: minimist(args.slice(eoaIndex + 1, args.length)),
		eoaArg: args[eoaIndex + 1]
	};

	// set the default base path to the plopfile directory
	const plop = nodePlop(plopfilePath, {
		force: argv.force || argv.f
	});
	const generators = plop.getGeneratorList();
	const generatorNames = generators.map((v) => v.name);

	// locate the generator name based on input and take the rest of the
	// user's input as prompt bypass data to be passed into the generator
	let generatorName = '';
	let bypassArr = [];

	for (let i=0; i < argv._.length; i++) {
		const nameTest = (generatorName.length ? generatorName + ' ' : '') + argv._[i];
		if (listHasOptionThatStartsWith(generatorNames, nameTest)) {
			generatorName = nameTest;
		} else {
			let index = argv._.findIndex(arg => arg === eoaArg);
			// If can't find index, slice until the very end - allowing all `_` to be passed
			index = index !== -1 ? index : argv._.length;
			// Force `'_'` to become undefined in nameless bypassArr
			bypassArr = argv._.slice(i, index).map(arg => arg === '_' ? undefined : arg);
			break;
		}
	}

	// hmmmm, couldn't identify a generator in the user's input
	if (!generatorName && !generators.length) {
		// no generators?! there's clearly something wrong here
		console.error(chalk.red('[PLOP] ') + 'No generator found in plopfile');
		process.exit(1);
	} else if (!generatorName && generators.length === 1) {
		// only one generator in this plopfile... let's assume they
		// want to run that one!
		handlePromptBypass(plop.getGenerator(generatorNames[0]), bypassArr, plopArgV);
	} else if (!generatorName && generators.length > 1 && !bypassArr.length) {
		// more than one generator? we'll have to ask the user which
		// one they want to run.
		out.chooseOptionFromList(generators, plop.getWelcomeMessage())
			.then((generatorName) => {
				handlePromptBypass(plop.getGenerator(generatorName), bypassArr, plopArgV);
			})
			.catch((err) => {
				console.error(chalk.red('[PLOP] ') + 'Something went wrong with selecting a generator', err);
			});
	} else if (generatorNames.includes(generatorName)) {
		// we have found the generator, run it!
		handlePromptBypass(plop.getGenerator(generatorName), bypassArr, plopArgV);
	} else {
		// we just can't make sense of your input... sorry :-(
		const fuzyGenName = (generatorName + ' ' + bypassArr.join(' ')).trim();
		console.error(chalk.red('[PLOP] ') + 'Could not find a generator for "' + fuzyGenName + '"');
		process.exit(1);
	}
}

/**
 *
 * @param generator - Name of the generator to be ran
 * @param bypassArr - The array of overwritten properties
 * @param plopArgV - The original args passed to plop without using names
 */
function handlePromptBypass(generator, bypassArr, plopArgV) {

	// Get named prompts that are passed to the command line
	const promptNames = generator.prompts.map((prompt) => prompt.name);

	// Check if bypassArr is too long for promptNames
	if (bypassArr.length > promptNames.length) {
		console.error(chalk.red('[PLOP] ') + 'Too many bypass arguments passed for "' + generator.name + '"');
		out.getHelpMessage(generator);
		process.exit(1);
	}

	if (Object.keys(plopArgV).length > 0) {
		// Let's make sure we made no whoopsy-poos (AKA passing incorrect inputs)
		let errors = false;
		Object.keys(plopArgV).forEach((arg) => {
			if (!(promptNames.find((name) => name === arg)) && arg !== '_') {
				console.error(chalk.red('[PLOP] ') + '"' + arg + '"' + ' is an invalid argument for "' + generator.name + '"');
				errors = true;
			}
		});
		if (errors) {
			out.getHelpMessage(generator);
			process.exit(1);
		}
		const namedBypassArr = promptNames.map((name) => plopArgV[name] ? plopArgV[name] : undefined);
		const bypass = mergeArrays(bypassArr, namedBypassArr);
		doThePlop(generator, bypass);
	} else {
		doThePlop(generator, bypassArr);
	}
}


/////
// everybody to the plop!
//
function doThePlop(generator, bypassArr) {
	console.clear();
	generator.runPrompts(bypassArr)
		.then(answers => {
			console.clear();
			const noMap = (argv['show-type-names'] || argv.t);
			const progress = ora();
			const onComment = (msg) => {
				progress.info(msg); progress.start();
			};
			const onSuccess = (change) => {
				let line = '';
				if (change.type) { line += ` ${out.typeMap(change.type, noMap)}`; }
				if (change.path) { line += ` ${change.path}`; }
				progress.succeed(line); progress.start();
			};
			const onFailure = (fail) => {
				let line = '';
				if (fail.type) { line += ` ${out.typeMap(fail.type, noMap)}`; }
				if (fail.path) { line += ` ${fail.path}`; }
				const errMsg = fail.error || fail.message;
				if (errMsg) { line += ` ${errMsg}` };
				progress.fail(line); progress.start();
			};
			progress.start();
			return generator.runActions(answers, {onSuccess, onFailure, onComment})
				.then(() => progress.stop());
		})
		.catch(function (err) {
			console.error(chalk.red('[ERROR]'), err.message);
			process.exit(1);
		});
}

function listHasOptionThatStartsWith(list, prefix) {
	return list.some(function (txt) {
		return txt.indexOf(prefix) === 0;
	});
}

function mergeArrays(oldArr, newArr) {
	const length = oldArr.length > newArr.length ? oldArr.length : newArr.length;
	const returnArr = [];
	for (let i = 0; i < length; i++) {
		returnArr.push(!(newArr[i] === undefined || newArr[i] === '_') ? newArr[i] :
			oldArr[i] === undefined ? '_' : oldArr[i]);
	}
	return returnArr;
}
