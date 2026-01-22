import picocolors from "picocolors";
import * as out from "./console-out.js";
import { createRequire } from "node:module";
import { argv, args, parseArgsAfter } from "./args.js";
const require = createRequire(import.meta.url);
const globalPkg = require("../package.json");

/**
 * Parses the user input to identify the generator to run and any bypass data
 * @param plop - The plop context
 * @param passArgsBeforeDashes - Should we pass args before `--` to the generator API
 */
function getBypassAndGenerator(plop, passArgsBeforeDashes) {
  // See if there are args to pass to generator
  const eoaIndex = args.indexOf("--");
  const { plopArgV, eoaArg } = passArgsBeforeDashes
    ? { plopArgV: argv }
    : eoaIndex === -1
      ? { plopArgV: [] }
      : {
          plopArgV: parseArgsAfter(eoaIndex + 1),
          eoaArg: args[eoaIndex + 1],
        };

  // locate the generator name based on input and take the rest of the
  // user's input as prompt bypass data to be passed into the generator
  let generatorName = "";
  let bypassArr = [];

  const generatorNames = plop.getGeneratorList().map((v) => v.name);
  for (let i = 0; i < argv._.length; i++) {
    const nameTest =
      (generatorName.length ? generatorName + " " : "") + argv._[i];
    if (listHasOptionThatStartsWith(generatorNames, nameTest)) {
      generatorName = nameTest;
    } else {
      let index = argv._.findIndex((arg) => arg === eoaArg);
      // If can't find index, slice until the very end - allowing all `_` to be passed
      index = index !== -1 ? index : argv._.length;
      // Force `'_'` to become undefined in nameless bypassArr
      bypassArr = argv._.slice(i, index).map((arg) =>
        /^_+$/.test(arg) ? undefined : arg,
      );
      break;
    }
  }

  return { generatorName, bypassArr, plopArgV };
}

function listHasOptionThatStartsWith(list, prefix) {
  return list.some(function (txt) {
    return txt.indexOf(prefix) === 0;
  });
}

/**
 * Handles all basic argument flags
 * @param env - Values parsed by Liftoff
 */
function handleArgFlags(env) {
  // Make sure that we're not overwriting `help`, `init,` or `version` args in generators
  if (argv._.length === 0) {
    // handle request for usage and options
    if (argv.help || argv.h) {
      out.displayHelpScreen();
      process.exit(0);
    }

    // handle request for initializing a new plopfile
    if (argv.init || argv.i || argv[`init-ts`]) {
      const force = argv.force === true || argv.f === true || false;
      try {
        out.createInitPlopfile(force, !!argv[`init-ts`]);
        process.exit(0);
      } catch (err) {
        console.error(picocolors.red("[PLOP] ") + err.message);
        process.exit(1);
      }
    }

    // handle request for version number
    if (argv.version || argv.v) {
      const localVersion = env.modulePackage.version;
      if (localVersion !== globalPkg.version && localVersion != null) {
        console.log(picocolors.yellow("CLI version"), globalPkg.version);
        console.log(picocolors.yellow("Local version"), localVersion);
      } else {
        console.log(globalPkg.version);
      }
      process.exit(0);
    }
  }

  // abort if there's no plopfile found
  if (env.configPath == null) {
    console.error(picocolors.red("[PLOP] ") + "No plopfile found");
    out.displayHelpScreen();
    process.exit(1);
  }
}

export { getBypassAndGenerator, handleArgFlags };
