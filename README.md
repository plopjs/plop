Plop
======

Micro-generator framework that makes it easy for an entire team to create files with a level or uniformity.

![plop demo](http://i.imgur.com/penUFkr.gif)

Plop is essentially glue code between  [inquirer](https://github.com/SBoudrias/Inquirer.js/) prompts and [handlebar](https://github.com/wycats/handlebars.js/) templates. You can also add your own handlebar helper methods and use them in your templates.

## Install
```
npm install -g plop
```

## Setup
The main parts of a plop generator are the plop file (`plopfile.js`) and the templates. Templates can either be inline, or in separate files.

A basic plop file starts its life as a lowly node module that exports a function that accepts the `plop` object.
``` javascript
module.exports = function (plop) {};
```
The `plop` object offers two main functions (`addHelper`, `setGenerator`). `addHelper` is directly passed through to the handlebars method `registerHelper`. So if you are familiar with [handlebars helpers](http://handlebarsjs.com/expressions.html#helpers), then you already know how this works.
``` javascript
module.exports = function (plop) {
    plop.addHelper('upperCase', function (text) {
		return text.toUpperCase();
	});
};
```
Next we need to setup a generator using `plop.setGenerator`
#### plop.setGenerator(name, config);
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
## Actions Array
The `plop.setGenerator` config object includes an array of actions to take. There are two types of actions you can include (add and modify). Both types of actions require a path to take action on (all paths are based on the location of the plopfile), and a template to use.

Let's start with the simpler of the 2 actions, `add`.

#### Add (Action)
The `add` action is used to (you guessed it) add files to your project. The path property is a handlebars template that will be used to create the file by name. The file contents will be determined by the `template` or `templateFile` property. As you've probably guessed, the `template` property is used for an inline template while the `templateFile` is a path to the template stored in a file somewhere else in the project. I suggest keeping your template files in a `plop-templates` folder at the root of the project.

#### Modify (Action)
The `modify` action is similar to `add`, but the main difference is that it will use a `pattern` property to find/replace text in the file specified by the `path` property. The `pattern` property should be a RegExp and capture groups can be used in the replacement template using $1, $2, etc. More details on modify can be found in the example folder.

## Baked-In Helpers
There are a few helpers that I have found useful enough to include with plop. They are mostly case modifiers, but here is the complete list.

- **camelCase**: changeFormatToThis
- **snakeCase**: change_format_to_this
- **dashCase/kabobCase**: change-format-to-this
- **dotCase**: change.format.to.this
- **pathCase**: change/format/to/this
- **properCase/pascalCase**: ChangeFormatToThis
- **lowerCase**: change format to this
- **sentenceCase**: Change format to this,
- **constantCase**: CHANGE_FORMAT_TO_THIS
- **titleCase**: Change Format To This
- **pkg**: look up a property from a package.json file in the same folder as the plopfile.

## Usage
Once plop is installed, and you have created a generator, you are ready to run plop from the terminal. Running `plop` with no parameters will present you with a list of generators to pick from. You can also run `plop [generatorName]` to trigger a generator directly.

## Why?
Because when you create your boilerplate separate from your code, you naturally put more thought into it.

Because saving your team (or yourself) 5-15 minutes when creating every route, component, controller, helper, test, view, etc... really adds up.

Because creating a new controller shouldn't mean copying another controller and stripping it of everything that is unique to it.

## Why Not Yeoman?
Yeoman is great and it does a fantastic job of scaffolding out an initial codebase for you. However, the initial codebase is just the beginning. I believe the true benefit to generators is not realized by saving a developer 40 hours in the beginning, but by saving a team days of work over the life of the project. Yes, yeoman has sub generators that do a similar job. However, if you're like me, you will continually tweak structure and code throughout the project till the sub generators that came built into your yeoman seed are no longer valid. These structures change as requirements change and code is refactored. So that got me thinking... you know, what I really want is for these generatorsto be part of the codebase. Plop does that for you.
