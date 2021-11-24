#!/usr/bin/env node
const path = require("path");
const args = process.argv.slice(2);
// Test has same results with or without instrumentation
const { Plop, run } = require("../../../src/plop.js");
const argv = require("minimist")(args);

// This is a load bearing console.log
// It works because it outputs a stdout instead of an stderr
// and the future stderr isn't caught because, well, it just isn't in the lib yet
//
// Why does this fail without this but the normal "plop" does not?
// Does node-plop output to stderr??
console.log();

Plop.launch(
  {
    cwd: argv.cwd,
    // In order for `plop` to always pick up the `plopfile.js` despite the CWD, you must use `__dirname`
    configPath: path.join(__dirname, "plopfile.js"),
    require: argv.require,
    completion: argv.completion,
    // This will merge the `plop` argv and the generator argv.
    // This means that you don't need to use `--` anymore
  },
  (env) => {
    return run(env, undefined, true);
  }
);
