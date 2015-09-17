Plop
======

Micro-generator framework that makes it easy for an entire team to create files with a level or uniformity.

![plop demo](http://i.imgur.com/penUFkr.gif)

Plop is essentially glue code between  [inquirer](https://github.com/SBoudrias/Inquirer.js/) prompts and [handlebar](https://github.com/wycats/handlebars.js/) templates. You can also add your own handlebar helper methods and use them in your templates.

## Installation
`npm install -g plop`

## Usage
Once plop is installed, your ready to create your first plopfile. Create `plopfile.js` at the root of your project and start adding your generators.

You can refer to the example folder in this repo for a working demo.

## Why?
Because when you create your boilerplate separate from your code, you naturally put more thought into it.

Because saving your team (or yourself) 5-15 minutes when creating every route, component, controller, helper, test, view, etc... really adds up.

Because creating a new controller shouldn't mean copying another controller and stripping it of everything that is unique to it.
