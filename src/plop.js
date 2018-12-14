#!/usr/bin/env node

'use strict';

const Liftoff = require('liftoff');
const args = process.argv.slice(2);
const argv = require('minimist')(args);
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
	const plopfilePath = env.configPath;

	// handle request for usage and options
	if (argv.help || argv.h) {
		out.displayHelpScreen();
		process.exit(0);
	}

	// handle request for initializing a new plopfile
	if (argv.init || argv.i) {
		return out.createInitPlopfile(env.cwd, function(err){
			if (err){
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
	const generatorNames = generators.map(function (v) { return v.name; });

	// locate the generator name based on input and take the rest of the
	// user's input as prompt bypass data to be passed into the generator
	let generatorName = '';
	let bypassArr = [];
	for (let i=0; i < argv._.length; i++) {
		const nameTest = (generatorName.length ? generatorName + ' ' : '') + argv._[i];
		if (listHasOptionThatStartsWith(generatorNames, nameTest)) {
			generatorName = nameTest;
		} else {
			bypassArr = argv._.slice(i);
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
		doThePlop(plop.getGenerator(generatorNames[0]), bypassArr);
	} else if (!generatorName && generators.length > 1 && !bypassArr.length) {
		// more than one generator? we'll have to ask the user which
		// one they want to run.
		out.chooseOptionFromList(generators, plop.getWelcomeMessage()).then(function (generatorName) {
			doThePlop(plop.getGenerator(generatorName));
		});
	} else if (generatorNames.indexOf(generatorName) >= 0) {
		// we have found the generator, run it!
		doThePlop(plop.getGenerator(generatorName), bypassArr);
	} else {
		// we just can't make sense of your input... sorry :-(
		const fuzyGenName = (generatorName + ' ' + bypassArr.join(' ')).trim();
		console.error(chalk.red('[PLOP] ') + 'Could not find a generator for "' + fuzyGenName + '"');
		process.exit(1);
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
