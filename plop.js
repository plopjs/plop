#!/usr/bin/env node

'use strict';

var path = require('path'),
	findup = require('findup-sync');

var plop = require('./mod/plop-base'),
	logic = require('./mod/logic'),
	out = require('./mod/console-out'),
	args = process.argv.slice(2),
	generator = args.length && args.shift() || '';

function run(plopfilePath) {
	var generators;

	// set the default base path to the plopfile directory
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

// locate the plopfile
try {
	var plopfilePath = findup('plopfile.js', {nocase: true});
	if (plopfilePath) {
		run(plopfilePath);
	} else {
		throw Error('No plopfile found.');
	}
} catch (e) {
	console.error(e.message);
	process.exit(1);
}
