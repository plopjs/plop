import * as fspp from "../fs-promise-proxy.js";

import {
  getRenderedTemplate,
  getRenderedTemplatePath,
  makeDestPath,
  throwStringifiedError,
  getRelativeToBasePath,
} from "./_common-action-utils.js";

import actionInterfaceTest from "./_common-action-interface-check.js";

const doPrepend = async function (data, cfg, plop, fileData) {
  const stringToPrepend = await getRenderedTemplate(data, cfg, plop);
  // if the prepended string should be unique (default),
  // remove any occurence of it (but only if pattern would match)

  const { separator = "\n" } = cfg;
  if (cfg.unique !== false) {
    // only remove after "pattern", so that we remove not too much accidentally
    const parts = fileData.split(cfg.pattern);
    const firstPart = parts[0];
    const lastPartWithoutDuplicates = firstPart.replace(
      new RegExp(stringToPrepend + separator, "g"),
      "",
    );
    fileData = fileData.replace(firstPart, lastPartWithoutDuplicates);
  }

  // add the prepended string to the start of the "fileData" if "pattern"
  // was not provided, i.e. null or false
  if (!cfg.pattern) {
    // make sure to add a "separator" if "fileData" is not empty
    if (fileData.length > 0) {
      fileData = separator + fileData;
    }
    return stringToPrepend + fileData;
  }

  return fileData.replace(cfg.pattern, stringToPrepend + separator + "$&");
};

export default async function (data, cfg, plop) {
  const interfaceTestResult = actionInterfaceTest(cfg);
  if (interfaceTestResult !== true) {
    throw interfaceTestResult;
  }
  const fileDestPath = makeDestPath(data, cfg, plop);
  try {
    // check path
    const pathExists = await fspp.fileExists(fileDestPath);
    if (!pathExists) {
      throw "File does not exist";
    } else {
      let fileData = await fspp.readFile(fileDestPath);
      cfg.templateFile = getRenderedTemplatePath(data, cfg, plop);
      fileData = await doPrepend(data, cfg, plop, fileData);
      await fspp.writeFile(fileDestPath, fileData);
    }
    return getRelativeToBasePath(fileDestPath, plop);
  } catch (err) {
    throwStringifiedError(err);
  }
}
