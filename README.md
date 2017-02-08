Plop
======

Micro-generator framework that makes it easy for an entire team to create files with a level of uniformity.

[![npm](https://img.shields.io/npm/dm/plop.svg)]()
[![npm](https://img.shields.io/npm/v/plop.svg)]()

![plop demo](http://i.imgur.com/penUFkr.gif)

Plop is essentially glue code between [inquirer](https://github.com/SBoudrias/Inquirer.js/) prompts and [handlebar](https://github.com/wycats/handlebars.js/) templates. You can also add your own handlebar helper methods and use them in your templates.

# Getting Started
## 1. Install plop globally
```
$ npm install -g plop
```
## 2. Install plop in your project's devDependencies
```
$ npm install --save-dev plop
```
## 3. Create a plopfile.js at the root of your project
``` javascript
module.exports = function (plop) {
	// create your generators here
	plop.setGenerator('basics', {
		description: 'this is a skeleton plopfile',
		prompts: [],
		actions: []
	});
};
```
---
# Anatomy of a Plop Generator
The main parts of a plop generator are the plop file (`plopfile.js`) and the templates. Templates can either be inline, or in separate files.

A basic plop file starts its life as a lowly node module that exports a function that accepts the `plop` object.
``` javascript
module.exports = function (plop) {};
```
The `plop` object offers four main functions (`addHelper`, `addPartial`, `addPrompt`, `setGenerator`).

## plop.addHelper(name, helper)
- name {String}
- helper {Function}

`addHelper` directly corresponds to the handlebars method `registerHelper`. So if you are familiar with [handlebars helpers](http://handlebarsjs.com/expressions.html#helpers), then you already know how this works.
``` javascript
module.exports = function (plop) {
	plop.addHelper('upperCase', function (text) {
		return text.toUpperCase();
	});

	// or in es6/es2015
	plop.addHelper('upperCase', (txt) => txt.toUpperCase());
};
```

## plop.addPartial(name, template)
- name {String}
- template {String}

`addPartial` directly corresponds to the handlebars method `registerPartial`. So if you are familiar with [handlebars partials](http://handlebarsjs.com/partials.html), then you should be good to go here as well.
``` javascript
module.exports = function (plop) {
	plop.addPartial('fullName', '{{ firstName }} {{ lastName }}');
};
```


## plop.addPrompt(name, inquirerPlugin)
- name {String}
- inquirerPlugin {Constructor}

`addPrompt` is a shortcut method to inquirer's `prompt.registerPrompt` function. If inquirer's built in prompt types don't quite cut the mustard for you, you can write your own or look at [this list of custom prompts](inquirer-prompts.md) that other plop users have found useful.
``` javascript
module.exports = function (plop) {
	plop.addPrompt('directory', require('inquirer-directory'));
};
```

Next we need to setup a generator using `plop.setGenerator`

## plop.setGenerator(name, config);
- name {String}
- config {Object}

The config object needs to include `prompts` and `actions` (`description` is optional). The prompts array is passed to [inquirer](https://github.com/SBoudrias/Inquirer.js/#objects). The `actions` array is a list of actions to take (described in greater detail below)

``` javascript
module.exports = function (plop) {
	plop.setGenerator('test', {
		description: 'this is a test',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'What is your name?',
			validate: function (value) {
				if ((/.+/).test(value)) { return true; }
				return 'name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'folder/{{dashCase name}}.txt',
			templateFile: 'templates/temp.txt'
		}]
	});
};
```
---
# The Actions Array
The `plop.setGenerator` config object includes an array of actions to take. There are two types of actions you can include (add and modify). Both types of actions require a path to take action on (all paths are based on the location of the plopfile), and a template to use.

Let's start with the simpler of the 2 actions, `add`.

#### Add (Action)
The `add` action is used to (you guessed it) add files to your project. The path property is a handlebars template that will be used to create the file by name. The file contents will be determined by the `template` or `templateFile` property. As you've probably guessed, the `template` property is used for an inline template while the `templateFile` is a path to the template stored in a file somewhere else in the project. I suggest keeping your template files in a `plop-templates` folder at the root of the project.

#### Modify (Action)
The `modify` action is similar to `add`, but the main difference is that it will use a `pattern` property to find/replace text in the file specified by the `path` property. The `pattern` property should be a RegExp and capture groups can be used in the replacement template using $1, $2, etc. More details on modify can be found in the example folder.

#### Custom (Action Function)
The `Add` and `Modify` actions will take care of almost every case that plop is designed to handle. However, plop does offer custom actions for the node/js guru. A custom action is a function that is provided in the actions array.
 - The custom action will be executed with the question responses as its only parameter.
 - Plop will wait for the custom action to complete before executing the next action.
 - The function must let plop known what’s happening through the return value. If you return a `Promise`, we won’t start other actions until the promise resolves. If you return a message (anything else except `undefined`), we know that the action is done. We’ll report the message in the status of the action.
 - A custom action fails if the promise is rejected, or the function throws an Exception

_See the [example plopfile](https://github.com/amwmedia/plop/blob/master/example/plopfile.js) for a sample synchronous custom action._

### Using a Dynamic Action Array
Alternatively, `actions` can itself be a function that takes responses `data` as a parameter and should return the actions array.

This allows you to adapt actions to provided answers:

``` javascript
module.exports = function (plop) {
	plop.setGenerator('test', {
		description: 'this is a test',
		prompts: [{
			type: 'input',
			name: 'name',
			message: 'What is your name?',
			validate: function (value) {
				if ((/.+/).test(value)) { return true; }
				return 'name is required';
			}
		},{
			type: 'confirm',
			name: 'wantTacos',
			message: 'Do you want tacos?'
		}],
		actions: function(data) {
			var actions = [];

			if(data.wantTacos) {
				actions.push({
					type: 'add',
					path: 'folder/{{dashCase name}}.txt',
					templateFile: 'templates/tacos.txt'
				});
			} else {
				actions.push({
					type: 'add',
					path: 'folder/{{dashCase name}}.txt',
					templateFile: 'templates/burritos.txt'
				});
			}

			return actions;
		}
	});
};
```
---

# Other Plop Methods/Attributes
These methods and attributes are available off the `plop` object. They are mostly used by plop internally, but some can come in handy when you're doing something a little more custom.

#### plop.load(targets, [config], [include]) - [see details](plop-load.md)
- targets {String | Array<String>}
- config {Object}
- include {Object}

loads generators, helpers and/or partials from another plopfile or npm module

#### plop.renderString(template, data)
 - template {String}
 - data {Object}

Renders the handlebars `template` using the `data` passed in. Returns the rendered template.

#### plop.getGenerator(name)
 - name {String}

Gets a generator config object by name.

#### plop.getGeneratorList()
Gets an array of generator names and descriptions.

#### plop.getPlopfilePath()
Returns the absolute path to the plopfile in use.

#### plop.inquirer
The instance of inquirer that plop is using internally.

#### plop.handlebars
The instance of handlebars that plop is using internally.

---

# Baked-In Helpers
There are a few helpers that I have found useful enough to include with plop. They are mostly case modifiers, but here is the complete list.

- **camelCase**: changeFormatToThis
- **snakeCase**: change_format_to_this
- **dashCase/kebabCase**: change-format-to-this
- **dotCase**: change.format.to.this
- **pathCase**: change/format/to/this
- **properCase/pascalCase**: ChangeFormatToThis
- **lowerCase**: change format to this
- **sentenceCase**: Change format to this,
- **constantCase**: CHANGE_FORMAT_TO_THIS
- **titleCase**: Change Format To This
- **pkg**: look up a property from a package.json file in the same folder as the plopfile.

---

# Usage
Once plop is installed, and you have created a generator, you are ready to run plop from the terminal. Running `plop` with no parameters will present you with a list of generators to pick from. You can also run `plop [generatorName]` to trigger a generator directly.

Run `plop --help` to display the manual of different options you can pass to plop, e.g., specify a custom path to the plopfile.

---

# Why?
Because when you create your boilerplate separate from your code, you naturally put more time and thought into it.

Because saving your team (or yourself) 5-15 minutes when creating every route, component, controller, helper, test, view, etc... [really adds up](https://xkcd.com/1205/).

Because [context switching is expensive](http://www.petrikainulainen.net/software-development/processes/the-cost-of-context-switching/) and [saving time is not the only benefit to automating workflows](https://medium.com/@kentcdodds/an-argument-for-automation-fce8394c14e2)

### Why Not Yeoman?
Yeoman is great and it does a fantastic job of scaffolding out an initial codebase for you. However, the initial codebase is just the beginning. I believe the true benefit to generators is not realized by saving a developer 40 hours in the beginning, but by saving a team days of work over the life of the project. Yes, yeoman has sub generators that do a similar job. However, if you're like me, you will continually tweak structure and code throughout the project till the sub generators that came built into your yeoman seed are no longer valid. These structures change as requirements change and code is refactored. Plop allows your generator code to live INSIDE your project and be versioned right along with the code it generates.

If you already have another generator that your organization uses and loves, use it :-). If you don't, try plop. It will make your code more consistent, save you lots of time, and (if you've read this far) you already know how to use it.
