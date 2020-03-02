import inquirer from 'inquirer';
// @types/globby doesn't export types for GlobOptions, so we have to work a little bit to extract them:
// GlobOptions is the second parameter of the sync function, which can be extracted with the Parameters<T> type
import { GlobbyOptions } from 'globby';
import {HelperDelegate as HelperFunction} from 'handlebars';

export interface NodePlopAPI {
  /**
   * Get the [GeneratorConfig](https://plopjs.com/documentation/#interface-generatorconfig) by name.
   */
  getGenerator(name: string): PlopGenerator;
  /**
   * Setup a generator.
   * The config object needs to include `prompts` and `actions` (`description`
   * is optional). The prompts array is passed to [inquirer](https://github.com/SBoudrias/Inquirer.js/#objects).
   * The `actions` array is a list of actions to take (described in greater
   * detail below).
   * @returns [GeneratorConfig](https://plopjs.com/documentation/#interface-generatorconfig)
   */
  setGenerator(name: string, config: PlopGenerator): PlopGenerator;

  /**
   * Registers a custom prompt type with inquirer.
   * [Inquirer](https://github.com/SBoudrias/Inquirer.js) provides many types
   * of prompts out of the box, but it also allows developers to build prompt
   * plugins. If you'd like to use a prompt plugin, you can register it with
   * `setPrompt`. For more details see the [Inquirer documentation for registering prompts](https://github.com/SBoudrias/Inquirer.js#inquirerregisterpromptname-prompt).
   * Also check out the [plop community driven list of custom prompts](https://github.com/amwmedia/plop/blob/master/inquirer-prompts.md).
   */
  setPrompt(name: string, prompt: inquirer.PromptModule): void;
  /**
   * Customizes the displayed message that asks you to choose a generator when
   * you run `plop`.
   */
  setWelcomeMessage(message: string): void;
  getWelcomeMessage(): string;
  /**
   * Gets an array of generator names and descriptions.
   */
  getGeneratorList(): { name: string; description: string }[];
  /**
   * Setup a handlebars partial.
   * Directly corresponds to the handlebars method `registerPartial`.
   * So if you are familiar with [handlebars helpers](http://handlebarsjs.com/expressions.html#helpers),
   * then you already know how this works.
   */
  setPartial(name: string, str: string): void;
  getPartial(name: string): string;
  getPartialList(): string[];
  /**
   * Setup handlebars helper.
   * Directly corresponds to the handlebars method `registerHelper`.
   * So if you are familiar with [handlebars partials](http://handlebarsjs.com/partials.html),
   * then you already know how this works.
   */
  setHelper(name: string, fn: HelperFunction): void;
  getHelper(name: string): Function;
  getHelperList(): string[];
  /**
   * Register a custom action type.
   * Allows you to create your own actions (similar to `add` or `modify`) that
   * can be used in your plopfiles. These are basically highly reusable
   * [custom action functions](https://plopjs.com/documentation/#custom-action-function-).
   */
  setActionType(name: string, fn: CustomActionFunction): void;
  getActionType(name: string): ActionType;
  getActionTypeList(): string[];

  /**
   * Set the `plopfilePath` value which is used internally to locate resources
   * like template files.
   */
  setPlopfilePath(filePath: string): void;
  /**
   * @returns the absolute path to the plopfile in use.
   */
  getPlopfilePath(): string;
  /**
   * @returns the base path that is used when creating files.
   */
  getDestBasePath(): string;

  /**
   * Loads generators, helpers and/or partials from another plopfile or
   * npm module.
   */
  load(
    target: string[] | string,
    loadCfg: PlopCfg,
    includeOverride: boolean
  ): void;
  /**
   * Sets the default config that will be used for this plopfile if it is
   * consumed by another plopfile using `plop.load()`.
   */
  setDefaultInclude(inc: object): void;
  /**
   * Gets the default config that will be used for this plopfile if it is
   * consumed by another plopfile using `plop.load()`.
   */
  getDefaultInclude(): object;

  /**
   * Runs `template` through the handlebars template renderer using `data`.
   * @returns the rendered template.
   */
  renderString(template: string, data: any): string; //set to any matching handlebars declaration

  // passthroughs for backward compatibility
  addPrompt: typeof inquirer.registerPrompt;
  addPartial(name: string, str: string): void;
  addHelper(name: string, fn: Function): void;
}

export type Actions = Array<ActionType | string>
export type DynamicActionFunction = (data?: any) => Actions

export interface PlopGenerator {
  /**
   * Short description of what this generator does.
   */
  description: string;
  /**
   * Questions to ask the user.
   */
  prompts: inquirer.Question[];
  /**
   * Actions to perform.
   * If your list of actions needs to be dynamic, take a look at
   * [using a dynamic actions array](https://plopjs.com/documentation/#using-a-dynamic-actions-array).
   */
  actions: Actions | DynamicActionFunction;
}

export type CustomActionFunction<TData extends object = object> = (
  /**
   * Answers to the generator prompts.
   */
  answers: object,
  /**
   * The object in the `actions` array for the generator.
   */
  config?: ActionConfig<TData>,
  /**
   * The plop api for the plopfile where this action is being run.
   */
  plopfileApi?: NodePlopAPI
) => Promise<string> | string; // Check return type?

export type ActionType<TData extends object = object> =
  | ActionConfig<TData>
  | AddActionConfig<TData>
  | AddManyActionConfig<TData>
  | ModifyActionConfig<TData>
  | AppendActionConfig<TData>
  | CustomActionFunction<TData>;

/**
 * There are several types of built-in actions you can use in your
 * [GeneratorConfig](https://plopjs.com/documentation/#interface-generatorconfig).
 * You specify which `type` of action (all paths are based on the location of
 * the plopfile), and a template to use.
 */
export interface ActionConfig<TData extends object = object> {
  /**
   * The type of action.
   */
  type: string;
  /**
   * Overwrites files if they exist.
   * @default false
   */
  force?: boolean;
  /**
   * @default {}
   */
  data?:
    | TData
    | ((...args: any[]) => TData | Promise<TData>);
  /**
   * @default true
   */
  abortOnFail?: boolean;
  /**
   * Skip an action if this function returns a string,
   * which is the reason it should be skipped.
   *
   * May also return a Promise which resolves to a string.
   *
   * The action will continue if action.skip()
   * returns or resolves to anything other than a string,
   * and the return value will be ignored.
   *
   * @default () => true
   */
  skip?: (data: TData) => void | string | Promise<void | string>;
}

/**
 * The `add` action is used to (you guessed it) add a file to your project.
 * The file contents will be determined by the `template` or `templateFile`
 * property.
 */
export interface AddActionConfig<TData extends object = object>
  extends ActionConfig<TData> {
  /**
   * The type of action.
   */
  type: 'add';
  /**
   * A handlebars template that will be used to create the file by name.
   */
  path: string;
  /**
   * A handlebars template that should be used to build the new file.
   */
  template?: string;
  /**
   * Path to a file containing the `template`.
   */
  templateFile?: string;
  /**
   * Skips a file if it already exists (instead of failing).
   * @default false
   */
  skipIfExists?: boolean;
  /**
   * Transform the template result before writing the file.
   */
  transform?: (templateResult: string, data: TData) => string;
}

/**
 * The `addMany` action can be used to add multiple files to your project with
 * a single action.
 * @example {{ dashCase name }}.spec.js
 */
export interface AddManyActionConfig<TData extends object = object>
  extends Pick<
    AddActionConfig<TData>,
    Exclude<keyof AddActionConfig<TData>, 'type'>
  > {
  /**
   * The type of action.
   */
  type: 'addMany';
  /**
   * A handlebars template that will be used to identify the folder that the
   * generated files should go into.
   */
  destination: string;
  /**
   * Can be used to alter what section of the template paths should be omitted
   * when creating files.
   */
  base: string;
  /**
   * The paths located by this glob can use handlebars syntax in their
   * file/folder names if you'd like the added file names to be unique.
   * @type Glob
   */
  templateFiles: string | string[];
  /**
   * File extensions that should be stripped from `templateFiles` files names
   * while being added to the `destination`.
   * @default ['hbs']
   */
  stripExtensions?: string[];
  /**
   * Change how to match to the template files to be added.
   */
  globOptions: GlobbyOptions;
  /**
   * Print each successfully added file path.
   * @default true
   */
  verbose?: boolean;
  /**
   * Transform the template result before writing the file.
   */
  transform?: (templateResult: string, data: TData) => string;
}

/**
 * The `modify` action will use a `pattern` property and/or a `transform` function 
 * to find/replace or transform text in the file located at the `path` specified.
 * 
 * `pattern` and `transform` can be used together or individually.
 * 
 * More details on modify can be found in the example folder.
 */
export interface ModifyActionConfig<TData extends object = object>
  extends ActionConfig<TData> {
  /**
   * The type of action.
   */
  type: 'modify';
  /**
   * Handlebars template that (when rendered) is the path of the file to be
   * modified.
   */
  path: string;
  /**
   * Used to match text that should be replaced.
   * @default end-of-file
   */
  pattern?: string | RegExp;
  /**
   * Handlebars template that should replace what was matched by the `pattern`.
   * Capture groups are available as `$1`, `$2`, etc.
   */
  template?: string;
  /**
   * Path a file containing the `template`.
   */
  templateFile?: string;
  /**
   * Transform the file contents immediately before writing to disk.
   */
  transform?: (fileContents: string, data: TData) => string;
}

/**
 * The `append` action is a commonly used subset of `modify`. It is used to
 * append data in a file at a particular location.
 */
export interface AppendActionConfig<TData extends object = object>
  extends ActionConfig<TData> {
  /**
   * The type of action.
   */
  type: 'append';
  /**
   * Handlebars template that (when rendered) is the path of the file to be
   * modified.
   */
  path: string;
  /**
   * Used to match text where the append should happen.
   */
  pattern: string | RegExp;
  /**
   * Whether identical entries should be removed.
   * @default true
   */
  unique?: boolean;
  /**
   * The value that separates entries.
   * @default newline
   */
  separator?: string;
  /**
   * Handlebars template to be used for the entry.
   */
  template: string;
  /**
   * Path a file containing the template.
   */
  templateFile: string;
}

export interface PlopCfg {
  force: boolean;
  destBasePath: string;
}

declare function nodePlop(plopfilePath: string, plopCfg?: PlopCfg): NodePlopAPI;
export default nodePlop;
