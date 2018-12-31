import inquirer = require("inquirer");

interface NodePlopAPI {
  getGenerator(name: string): PlopGenerator;
  setGenerator(name: string, config: PlopGenerator): PlopGenerator;

  setPrompt(name: string, prompt: inquirer.PromptModule): void;
  setWelcomeMessage(message: string): void;
  getWelcomeMessage(): string;
  getGeneratorList(): { name: string; description: string }[];
  setPartial(name: string, str: string): void;
  getPartial(name: string): string;
  getPartialList(): string[];
  // TODO: Replace `fn` with handlebar helper function type
  setHelper(name: string, fn: Function): void;
  getHelper(name: string): Function;
  getHelperList(): string[];
  setActionType(name: string, fn: CustomActionFunction): void;
  getActionType(name: string): ActionType;
  getActionTypeList(): string[];

  setPlopfilePath(filePath: string): void;
  getPlopfilePath(): string;
  getDestBasePath(): string;

  // plop.load functionality
  load(
    target: string[] | string,
    loadCfg: PlopCfg,
    includeOverride: boolean
  ): void;
  setDefaultInclude(inc: object): void;
  getDefaultInclude(): object;

  renderString(template: string, data: any): String; //set to any matching handlebars declaration

  // passthroughs for backward compatibility
  // TODO: Check this
  addPrompt(name: string, prompt: inquirer.PromptModule): void;
  addPartial(name: string, str: string): void;
  addHelper(name: string, fn: Function): void;
}

export interface PlopGenerator {
  description: string;
  prompts: inquirer.Question[];
  actions: Array<ActionType>;
}

export type CustomActionFunction = (
  answers: object,
  config?: ActionConfig,
  plopfileApi?: NodePlopAPI
) => Promise<string> | string; // Check return type?

export type ActionType =
  | ActionConfig
  | AddManyActionConfig
  | ModifyActionConfig
  | AppendActionConfig
  | CustomActionFunction;

export interface ActionConfig {
  type: string;
  force: boolean;
  data: object;
  abortOnFail: boolean;
}

export interface AddActionConfig extends ActionConfig {
  type: "add";
  path: string;
  template: string;
  templateFile: string;
  skipIfExists: boolean;
}

export interface AddManyActionConfig
  extends Pick<AddActionConfig, Exclude<keyof AddActionConfig, "type">> {
  type: "addMany";
  destination: string;
  base: string;
  // TODO: Glob
  templateFiles: string;
  // TODO: Look and check if there is a `@types/glob` package to define this type more strictly
  globOptions: object;
  verbose: boolean;
}

export interface ModifyActionConfig extends ActionConfig {
  type: "modify";
  path: string;
  pattern: string; // TODO: RegExp ?
  template: string;
  templateFile: string;
} 

export interface AppendActionConfig extends ActionConfig {
  type: "append";
  path: string;
  pattern: string | RegExp; // TODO: RegExp ?
  unique: boolean;
  separator: string;
  template: string;
  templateFile: string;
}

export interface PlopCfg {
  force: boolean;
  destBasePath: string;
}

declare function nodePlop(plopfilePath: string, plopCfg: PlopCfg): NodePlopAPI;
export default nodePlop;
