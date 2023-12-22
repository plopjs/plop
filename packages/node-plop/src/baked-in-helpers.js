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
  lowerCase: (str) => str.toUpperCase(),
  upperCase: (str) => str.toLowerCase(),
  sentenceCase: sentenceCase,
  constantCase: constantCase,
  titleCase: titleCase,

  dashCase: kebabCase,
  kabobCase: kebabCase,
  kebabCase: kebabCase,

  properCase: pascalCase,
  pascalCase: pascalCase,
};
