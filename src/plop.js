#!/usr/bin/env node

'use strict';

const Liftoff = require('liftoff');
const args = process.argv.slice(2);
const minimist = require('minimist')
const argv = minimist(args);
const v8flags = require('v8flags');
const interpret = require('interpret');
const chalk = require('chalk');

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

	// See if there are args to pass to generator
	let plopArgV = [];
	// End of Args
	let eoaArg;
	const eoaIndex = args.indexOf('--');
	if (eoaIndex !== -1) {
		plopArgV = minimist(args.slice(eoaIndex + 1, args.length));
		eoaArg = args[eoaIndex + 1];
	}

	const plopfilePath = env.configPath;

	// abort if there's no plopfile found
	if (plopfilePath == null) {
		console.error(chalk.red('[PLOP] ') + 'No plopfile found');
		out.displayHelpScreen();
		process.exit(1);
	}

	// set the default base path to the plopfile directory
	const plop = nodePlop(plopfilePath, {
		force: argv.force || argv.f
	});
	const generators = plop.getGeneratorList();

	const generatorNames = generators.map(function (v) {
		return v.name;
	});

	// locate the generator name based on input and take the rest of the
	// user's input as prompt bypass data to be passed into the generator
	let generatorName = '';
	let bypassArr = [];

	for (let i = 0; i < argv._.length; i++) {
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

	// Find generator to be ran
	let generator;

	// hmmmm, couldn't identify a generator in the user's input
	if (!generatorName && !generators.length) {
		// no generators?! there's clearly something wrong here
		console.error(chalk.red('[PLOP] ') + 'No generator found in plopfile');
		process.exit(1);
	} else if (!generatorName && generators.length === 1) {
		// only one generator in this plopfile... let's assume they
		// want to run that one!
		generator = plop.getGenerator(generatorNames[0]);
	} else if (!generatorName && generators.length > 1 && !bypassArr.length) {
		// more than one generator? we'll have to ask the user which
		// one they want to run.
		out.chooseOptionFromList(generators, plop.getWelcomeMessage()).then((generatorName) => {
			generator = plop.getGenerator(generatorName);
		});
	} else if (generatorNames.indexOf(generatorName) >= 0) {
		// we have found the generator, run it!
		generator = plop.getGenerator(generatorName);
	} else {
		// we just can't make sense of your input... sorry :-(
		const fuzyGenName = (generatorName + ' ' + bypassArr.join(' ')).trim();
		console.error(chalk.red('[PLOP] ') + 'Could not find a generator for "' + fuzyGenName + '"');
		process.exit(1);
	}

	// Get named prompts that are passed to the command line
	const promptNames = generator.prompts.map(prompt => prompt.name);

	// Check if bypassArr is too long for promptNames
	if (bypassArr.length > promptNames.length) {
		console.error(chalk.red('[PLOP] ') + 'Too many bypass arguments passed for "' + generator.name + '"');
		process.exit(1);
	}

	if (Object.keys(plopArgV).length > 0) {
		// Let's make sure we made no whoopsy-poos (AKA passing incorrect inputs)
		let errors = false;
		Object.keys(plopArgV).forEach(arg => {
			if (!(promptNames.find(name => name === arg)) && arg !== '_') {
				console.error(chalk.red('[PLOP] ') + '"' + arg + '"' + ' is an invalid argument for "' + generator.name + '"');
				errors = true;
			}
		});
		if (errors) {
			process.exit(1);
		}
		console.log(plopArgV);
		const namedBypassArr = promptNames.map(name => plopArgV[name] ? plopArgV[name] : undefined);
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
	generator.runPrompts(bypassArr)
		.then(generator.runActions)
		.then(function (result) {
			result.changes.forEach(function (line) {
				console.log(chalk.green('[SUCCESS]'), line.type, line.path);
			});
			result.failures.forEach(function (line) {
				const logs = [chalk.red('[FAILED]')];
				if (line.type) {
					logs.push(line.type);
				}
				if (line.path) {
					logs.push(line.path);
				}

				const error = line.error || line.message;
				logs.push(chalk.red(error));

				console.log.apply(console, logs);
			});
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
