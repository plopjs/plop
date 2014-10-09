#!/usr/bin/env node
'use strict';
var path = require('path'),
	findup = require('findup-sync');

var plop = require('./mod/plop-base'),
	out = require('./mod/console-out'),
	logic = require('./mod/logic'),
	fs = require('./mod/fs-promise'),
	args = process.argv.slice(2),
	generator = args.length && args.shift() || '';

function run(plopfilePath) {
	
	// set the default base path to the plopfile directory
	plop.setBasePath(path.dirname(plopfilePath));

	// run the plopfile against the plop object
	require(plopfilePath)(plop);

	fs.folderList(plop.getPlopFolderPath())
		.then(function (plopList) {
			if (!generator || plopList.indexOf(generator) === -1) {
				return out.listOptions(plopList);
			} else {
				return generator;
			}
		})
		.then(logic.getPlopData)
		.then(logic.executePlop)
		.fail(function (err) {
			console.error(err);
			process.exit(1);
		});
}

// locate the plopfile
try {
	var plopfilePath = findup('plopfile.js', {nocase: true});
	run(plopfilePath);
} catch (e) {
	console.log(e.message);
	process.exit(1);
}