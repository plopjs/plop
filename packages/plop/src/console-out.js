import picocolors from "picocolors";
import nodePlop from "node-plop";
import fs from "node:fs";

const defaultChoosingMessage =
  picocolors.blue("[PLOP]") + " Please choose a generator.";

function getHelpMessage(generator) {
  const maxLen = Math.max(
    ...generator.prompts.map((prompt) => prompt.name.length),
  );
  console.log(
    [
      "",
      picocolors.bold("Options:"),
      ...generator.prompts.map(
        (prompt) =>
          "  --" +
          prompt.name +
          " ".repeat(maxLen - prompt.name.length + 2) +
          picocolors.dim(prompt.help ? prompt.help : prompt.message),
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
              p.name +
              picocolors.gray(p.description ? " - " + p.description : ""),
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
      picocolors.bold("Usage:"),
      "  $ plop                 " +
        picocolors.dim("Select from a list of available generators"),
      "  $ plop <name>          " +
        picocolors.dim("Run a generator registered under that name"),
      "  $ plop <name> [input]  " +
        picocolors.dim("Run the generator with input data to bypass prompts"),
      "",
      picocolors.bold("Options:"),
      "  -h, --help             " + picocolors.dim("Show this help display"),
      "  -t, --show-type-names  " +
        picocolors.dim("Show type names instead of abbreviations"),
      "  -i, --init             " +
        picocolors.dim("Generate a basic plopfile.js"),
      "      --init-ts          " +
        picocolors.dim("Generate a basic plopfile.ts"),
      "  -v, --version          " + picocolors.dim("Print current version"),
      "  -f, --force            " +
        picocolors.dim("Run the generator forcefully"),
      "",
      picocolors.dim(" ------------------------------------------------------"),
      picocolors.dim("  ⚠  danger waits for those who venture below the line"),
      "",
      picocolors.dim("  --plopfile             Path to the plopfile"),
      picocolors.dim(
        "  --cwd                  Directory from which relative paths are calculated against while locating the plopfile",
      ),
      picocolors.dim(
        "  --preload              String or array of modules to require before running plop",
      ),
      picocolors.dim(
        "  --dest                 Output to this directory instead of the plopfile's parent directory",
      ),
      picocolors.dim("  --no-progress          Disable the progress bar"),
      "",
      picocolors.bold("Examples:"),
      "  $ " + picocolors.blue("plop"),
      "  $ " + picocolors.blue("plop component"),
      "  $ " + picocolors.blue('plop component "name of component"'),
      "",
    ].join("\n"),
  );
}

function createInitPlopfile(force = false, useTypescript = false) {
  var initString = (() => {
    if (useTypescript) {
      return (
        "import type { NodePlopAPI } from 'plop'\n" +
        "\n" +
        "export default async function (plop: NodePlopAPI) {\n" +
        "\n" +
        "}\n" +
        "\n"
      );
    } else {
      return (
        "export default function (plop) {\n\n" +
        "\tplop.setGenerator('basics', {\n" +
        "\t\tdescription: 'this is a skeleton plopfile',\n" +
        "\t\tprompts: [],\n" +
        "\t\tactions: []\n" +
        "\t});\n\n" +
        "};"
      );
    }
  })();

  [`js`, `cjs`, `ts`].forEach((ext) => {
    const name = `plopfile.${ext}`;
    if (fs.existsSync(process.cwd() + `/${name}`) && force === false) {
      throw Error(`"${name}" already exists at this location.`);
    }
  });

  const outExt = useTypescript ? `ts` : `js`;
  fs.writeFileSync(process.cwd() + `/plopfile.${outExt}`, initString);
}

const typeDisplay = {
  function: picocolors.yellow("->"),
  add: picocolors.green("++"),
  addMany: picocolors.green("+!"),
  modify: `${picocolors.green("+")}${picocolors.red("-")}`,
  append: picocolors.green("_+"),
  skip: picocolors.green("--"),
};
const typeMap = (name, noMap) => {
  const dimType = picocolors.dim(name);
  return noMap ? dimType : typeDisplay[name] || dimType;
};

export {
  chooseOptionFromList,
  displayHelpScreen,
  createInitPlopfile,
  typeMap,
  getHelpMessage,
};
