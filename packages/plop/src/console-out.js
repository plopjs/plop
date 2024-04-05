import chalk from "chalk";
import nodePlop from "node-plop";
import fs from "node:fs";

const defaultChoosingMessage =
  chalk.blue("[PLOP]") + " Please choose a generator.";

function getHelpMessage(generator) {
  const maxLen = Math.max(
    ...generator.prompts.map((prompt) => prompt.name.length),
  );
  console.log(
    [
      "",
      chalk.bold("Options:"),
      ...generator.prompts.map(
        (prompt) =>
          "  --" +
          prompt.name +
          " ".repeat(maxLen - prompt.name.length + 2) +
          chalk.dim(prompt.help ? prompt.help : prompt.message),
      ),
    ].join("\n"),
  );
}

async function chooseOptionFromList(plopList, message) {
  const plop = await nodePlop();
  const generator = plop.setGenerator("choose", {
    prompts: [
      {
        type: "list",
        name: "generator",
        message: message || defaultChoosingMessage,
        choices: plopList.map(function (p) {
          return {
            name:
              p.name + chalk.gray(!!p.description ? " - " + p.description : ""),
            value: p.name,
          };
        }),
      },
    ],
  });
  return generator.runPrompts().then((results) => results.generator);
}

function displayHelpScreen() {
  console.log(
    [
      "",
      chalk.bold("Usage:"),
      "  $ plop                 " +
        chalk.dim("Select from a list of available generators"),
      "  $ plop <name>          " +
        chalk.dim("Run a generator registered under that name"),
      "  $ plop <name> [input]  " +
        chalk.dim("Run the generator with input data to bypass prompts"),
      "",
      chalk.bold("Options:"),
      "  -h, --help             " + chalk.dim("Show this help display"),
      "  -t, --show-type-names  " +
        chalk.dim("Show type names instead of abbreviations"),
      "  -i, --init             " + chalk.dim("Generate a basic plopfile.js"),
      "      --init-ts          " + chalk.dim("Generate a basic plopfile.ts"),
      "  -v, --version          " + chalk.dim("Print current version"),
      "  -f, --force            " + chalk.dim("Run the generator forcefully"),
      "",
      chalk.dim(" ------------------------------------------------------"),
      chalk.dim("  ⚠  danger waits for those who venture below the line"),
      "",
      chalk.dim("  --plopfile             Path to the plopfile"),
      chalk.dim(
        "  --cwd                  Directory from which relative paths are calculated against while locating the plopfile",
      ),
      chalk.dim(
        "  --preload              String or array of modules to require before running plop",
      ),
      chalk.dim(
        "  --dest                 Output to this directory instead of the plopfile's parent directory",
      ),
      chalk.dim("  --no-progress          Disable the progress bar"),
      "",
      chalk.bold("Examples:"),
      "  $ " + chalk.blue("plop"),
      "  $ " + chalk.blue("plop component"),
      "  $ " + chalk.blue('plop component "name of component"'),
      "",
    ].join("\n"),
  );
}

function createInitPlopfile(force = false, useTypescript = false) {
  var initString = (()=>{
    if(useTypescript) {
      return "import type { NodePlopAPI } from 'plop'\n" +
      "\n" +
      "export default async function (plop: NodePlopAPI) {\n" +
      "\n" +
      "}\n" +
      "\n";
    } else {
      return "export default function (plop) {\n\n" +
      "\tplop.setGenerator('basics', {\n" +
      "\t\tdescription: 'this is a skeleton plopfile',\n" +
      "\t\tprompts: [],\n" +
      "\t\tactions: []\n" +
      "\t});\n\n" +
      "};";
    }
  })();

  [`js`, `cjs`, `ts`].forEach(ext => {
    const name = `plopfile.${ext}`;
    if (fs.existsSync(process.cwd() + `/${name}`) && force === false) {
      throw Error(`"${name}" already exists at this location.`);
    }
  });

  const outExt = useTypescript ? `ts` : `js`
  fs.writeFileSync(process.cwd() + `/plopfile.${outExt}`, initString);
}

const typeDisplay = {
  function: chalk.yellow("->"),
  add: chalk.green("++"),
  addMany: chalk.green("+!"),
  modify: `${chalk.green("+")}${chalk.red("-")}`,
  append: chalk.green("_+"),
  skip: chalk.green("--"),
};
const typeMap = (name, noMap) => {
  const dimType = chalk.dim(name);
  return noMap ? dimType : typeDisplay[name] || dimType;
};

export {
  chooseOptionFromList,
  displayHelpScreen,
  createInitPlopfile,
  typeMap,
  getHelpMessage,
};
