#!/usr/bin/env node

'use strict';

var fs = require('fs'),
	path = require('path'),
	findup = require('findup-sync'),
	pkg = require('./package.json'),
	program = require('commander');

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

program
	.version(pkg.version);

program
	.command('init')
	.description('setup a plopfile.js in the current directory')
	.option("-v, --verbose", "Install the verbose plopfile.js found in examples")
	.action(function(options) {
		var plopfile = (options.verbose) ? fs.readFileSync(path.join('example', 'plopfile.js')) : fs.readFileSync(path.join('example', 'plopfile-bare.js'));
		fs.mkdir('plop-templates');
		fs.writeFile('plopfile.js', plopfile);
		console.log('Created plopfile.js and plop-templates directory.');
	});

// locate the plopfile
// I think we should refactor this
// instead it might make more sense to pass plop.getGeneratorList to commander
// as a series of commands
// I'll keep working on this
try {
	var plopfilePath = findup('plopfile.js', {nocase: true});
	if (plopfilePath) {
		run(plopfilePath);
	} else {
		if (!process.argv.slice(2).length) {
			program.help();
		} else {
			program.parse(process.argv);
		}
	}
} catch (e) {
	console.error(e.message);
	process.exit(1);
}
