#!/usr/bin/env node
import { Plop, run } from "../src/plop.js";
import { argv } from "../src/args.js";

Plop.prepare(
  {
    cwd: argv.cwd,
    preload: argv.preload || [],
    configPath: argv.plopfile,
    completion: argv.completion,
  },
  function (env) {
    Plop.execute(env, run);
  },
);
