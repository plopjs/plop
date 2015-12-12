#!/usr/bin/env node --harmony

'use strict';

var path = require('path');
var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var v8flags = require('v8flags');
var interpret = require('interpret');

var plop = require('./mod/plop-base');
var logic = require('./mod/logic');
var out = require('./mod/console-out');
var generator = argv.length && argv.shift() || '';

var Plop = new Liftoff({
	name: 'plop',
	extensions: interpret.jsVariants,
	v8flags: v8flags
});

Plop.launch({
	cwd: argv.cwd,
	configPath: argv.plopfile,
	require: argv.require,
	completion: argv.completion,
	verbose: argv.verbose
}, run);

function run(env) {
	var generators;

	// set the default base path to the plopfile directory
  var plopfilePath = env.configPath;
  plop.setPlopfilePath(path.dirname(plopfilePath));

	// run the plopfile against the plop object
	require(plopfilePath)(plop);

	generators = plop.getGeneratorList();
	if (!generator) {
		out.chooseOptionFromList(generators).then(go);
	}else if (generators.map(function (v) { return v.name; }).indexOf(generator) > -1) {
		go(generator);
	} else {
		throw Error('Generator ' + generator + ' not found in plopfile');
	}
}

function go(generator) {
	logic.getPlopData(generator)
		.then(logic.executePlop)
		.then(function (result) {
			result.changes.forEach(function(line) {
				console.log('SUCCESS'.green + ':', line.type, line.path);
			});
			result.failures.forEach(function(line) {
				console.log('FAILED'.red + ':', line.type, line.path, line.error);
			});
		})
		.fail(function (err) {
			console.error('ERROR', err.message, err.stack);
			process.exit(1);
		});
}
