#!/usr/bin/env node
import { Plop, run } from "../src/plop.js";
import minimist from "minimist";

import { fork } from "child_process";

import { createRequire } from "node:module";
import { pathToFileURL } from "url";
const require = createRequire(import.meta.url);

/**
 * This is required as otherwise ts-node may not resolve in paths outside of the
 * plop node_modules directory
 */
const esm = require.resolve("ts-node/esm");
const loaderString = `--loader=${pathToFileURL(esm).href}`;

if (!process.execArgv.includes(loaderString)) {
  // Get the node binary, file, and non-node arguments that we ran with
  const [nodeBin, module, ...args] = process.argv;

  // Re-running with ts-node/esm loader
  fork(module, args, {
    execArgv: [
      // Get the arguments passed to the node binary
      ...process.execArgv,
      loaderString,
      "--no-warnings=ExperimentalWarning",
    ],
  }).once("close", process.exit);
} else {
  const args = process.argv.slice(2);
  const argv = minimist(args);

  // Normal operation
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
}
