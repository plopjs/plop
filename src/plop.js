#!/usr/bin/env node

'use strict';

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var v8flags = require('v8flags');
var interpret = require('interpret');
var chalk = require('chalk');

var nodePlop = require('node-plop');
var out = require('./console-out');
var globalPkg = require('../package.json');
var generator = argv._.join(' ') || null;

var Plop = new Liftoff({
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
	var generators, plopfilePath, plop;

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

	plopfilePath = env.configPath;
	// abort if there's no plopfile found
	if (plopfilePath == null) {
		console.error(chalk.red('[PLOP] ') + 'No plopfile found');
		out.displayHelpScreen();
		process.exit(1);
	}

	// set the default base path to the plopfile directory
	plop = nodePlop(plopfilePath);
	generators = plop.getGeneratorList();
	if (!generator) {
		out.chooseOptionFromList(generators).then(function (generatorName) {
			doThePlop(plop.getGenerator(generatorName));
		});
	} else if (generators.map(function (v) { return v.name; }).indexOf(generator) > -1) {
		doThePlop(plop.getGenerator(generator));
	} else {
		console.error(chalk.red('[PLOP] ') + 'Generator "' + generator + '" not found in plopfile');
		process.exit(1);
	}

}

/////
// everybody to the plop!
//
function doThePlop(generator) {
	generator.runPrompts().then(generator.runActions)
		.then(function (result) {
			result.changes.forEach(function(line) {
				console.log(chalk.green('[SUCCESS]'), line.type, line.path);
			});
			result.failures.forEach(function (line) {
				var logs = [chalk.red('[FAILED]')];
				if (line.type) { logs.push(line.type); }
				if (line.path) { logs.push(line.path); }

				var error = line.error || line.message;
				logs.push(chalk.red(error));

				console.log.apply(console, logs);
			});
		})
		.catch(function (err) {
			console.error(chalk.red('[ERROR]'), err.message, err.stack);
			process.exit(1);
		});
}
