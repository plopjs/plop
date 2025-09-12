#!/usr/bin/env node
const args = process.argv.slice(2);
import { Plop, run } from "../src/plop.js";
import minimist from "minimist";
const argv = minimist(args);

Plop.prepare(
  {
    cwd: argv.cwd,
    preload: argv.preload || [],
    configPath: argv.plopfile,
    completion: argv.completion,
  },
  function (env) {
    Plop.execute(env, (env, argv) => run(env, argv).catch( err => {
      console.error(chalk.red("[ERROR]"), err.message);
      process.exit(1);
    }));
  },
);
