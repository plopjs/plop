import path from "path";
import fs from "fs";
import { globSync } from "tinyglobby";
import actionInterfaceTest from "./_common-action-interface-check.js";
import addFile from "./_common-action-add-file.js";
import { normalizePath } from "./_common-action-utils.js";

const defaultConfig = {
  verbose: true,
  stripExtensions: ["hbs"],
};

export default async function (data, userConfig, plop) {
  // shallow-merge default config and input config
  const cfg = Object.assign({}, defaultConfig, userConfig);
  // check the common action interface attributes. skip path check because it's NA
  const interfaceTestResult = actionInterfaceTest(cfg, { checkPath: false });
  if (interfaceTestResult !== true) {
    throw interfaceTestResult;
  }
  // check that destination (instead of path) is a string value
  const dest = cfg.destination;
  if (typeof dest !== "string" || dest.length === 0) {
    throw `Invalid destination "${dest}"`;
  }

  if (cfg.base) {
    cfg.base = plop.renderString(cfg.base, data);
  }

  if (typeof cfg.templateFiles === "function") {
    cfg.templateFiles = cfg.templateFiles();
  }

  cfg.templateFiles = []
    .concat(cfg.templateFiles) // Ensure `cfg.templateFiles` is an array, even if a string is passed.
    .map((file) => plop.renderString(file, data)); // render the paths as hbs templates

  const templateFiles = resolveTemplateFiles(
    cfg.templateFiles,
    cfg.base,
    cfg.globOptions,
    plop,
  );

  const filesAdded = [];
  const plopFilePath = path.resolve(plop.getPlopfilePath());
  const absBasePath = path.resolve(plopFilePath, cfg.base || "");
  for (let templateFile of templateFiles) {
    const relativeTemplatePath = path.relative(absBasePath, templateFile);
    const fileCfg = Object.assign({}, cfg, {
      path: stripExtensions(
        cfg.stripExtensions,
        resolvePath(cfg.destination, relativeTemplatePath, cfg.base),
      ),
      templateFile: templateFile,
    });
    const addedPath = await addFile(data, fileCfg, plop);
    filesAdded.push(addedPath);
  }

  const summary = `${filesAdded.length} files added`;
  if (!cfg.verbose) return summary;
  else return `${summary}\n -> ${filesAdded.join("\n -> ")}`;
}

function resolveTemplateFiles(templateFilesGlob, basePath, globOptions, plop) {
  const absPlopfilePath = path.resolve(plop.getPlopfilePath());
  const absBasePath = path.resolve(absPlopfilePath, basePath || "");
  return globSync(templateFilesGlob, {
    cwd: absPlopfilePath,
    braceExpansion: false,
    expandDirectories: true,
    absolute: true,
    ...globOptions,
  })
    .filter(isUnder(absBasePath))
    .filter(isAbsoluteOrRelativeFileTo(absPlopfilePath));
}
function isAbsoluteOrRelativeFileTo(basePath) {
  return (file) => fs.existsSync(file) && fs.lstatSync(file).isFile();
}

function isUnder(basePath = "") {
  const normalizedBasePath = basePath.replace(/\\/g, "/");
  return (file) => file.startsWith(normalizedBasePath);
}

function resolvePath(destination, file, rootPath) {
  return normalizePath(
    path.join(destination, dropFileRootPath(file, rootPath)),
  );
}

function dropFileRootPath(file, rootPath) {
  return rootPath ? file.replace(rootPath, "") : dropFileRootFolder(file);
}

function dropFileRootFolder(file) {
  const fileParts = path.normalize(file).split(path.sep);
  fileParts.shift();

  return fileParts.join(path.sep);
}

function stripExtensions(shouldStrip, fileName) {
  const maybeFile = path.parse(fileName);

  if (
    Array.isArray(shouldStrip) &&
    !shouldStrip.map((item) => `.${item}`).includes(maybeFile.ext)
  )
    return fileName;

  return path.parse(maybeFile.name).ext !== "" || maybeFile.name.startsWith(".")
    ? path.join(maybeFile.dir, maybeFile.name)
    : fileName;
}
