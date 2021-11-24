#!/usr/bin/env node
const args = process.argv.slice(2);
import { Plop, run } from "../src/plop.js";
import minimist from "minimist";
const argv = minimist(args);

Plop.launch(
  {
    cwd: argv.cwd,
    configPath: argv.plopfile,
    require: argv.require,
    completion: argv.completion,
  },
  run
);
