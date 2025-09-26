import {
  camelCase,
  snakeCase,
  dotCase,
  pathCase,
  sentenceCase,
  constantCase,
  kebabCase,
  pascalCase,
} from "change-case";
import { titleCase } from "title-case";

export default {
  camelCase: camelCase,
  snakeCase: snakeCase,
  dotCase: dotCase,
  pathCase: pathCase,
  lowerCase: (str) => str.toLowerCase(),
  upperCase: (str) => str.toUpperCase(),
  sentenceCase: sentenceCase,
  constantCase: constantCase,
  titleCase: titleCase,

  dashCase: kebabCase,
  kabobCase: kebabCase,
  kebabCase: kebabCase,

  properCase: pascalCase,
  pascalCase: pascalCase,
};
