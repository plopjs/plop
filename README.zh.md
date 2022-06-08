# 快速上手

[![npm](https://img.shields.io/npm/dm/plop.svg)](https://www.npmjs.com/package/plop)
&nbsp;
[![npm](https://img.shields.io/npm/v/plop.svg)](https://www.npmjs.com/package/plop)
&nbsp;
[![plop on slack](https://img.shields.io/badge/slack-join%20workspace-green)](https://join.slack.com/t/plopjs/shared_invite/zt-ehh69el1-2_DjgZRuMbpC9RnEa4M8cA)

文档版本：plop@3.1.0 - [plop@3.1.0](https://github.com/plopjs/plop/releases/tag/plop%403.1.0)

## 什么是 Plop？

Plop是一个“微生成器框架”——之所以这样定义它，是因为Plop是一个用于生成代码文件或其他纯文本文件的小工具。并且简单、高效、同时保证一致性。在开发中我们的代码往往基于“框架”和“关键字”的组合（路由、控制器、模板、等等）。这些组合往往随着时间的推移和开发的进行不断的会被完善和调整。当你需要创建一个同类型的文件时，你往往很难在浩如烟海的代码仓库中找到当初的那个“最佳实践”。而Plop专为解决此类问题而生，通过使用Plop，你只需要在控制台输入`Plop`命令，即可创建任何格式的、已经提前编写好的“最佳实现”代码。这不仅节约了你在搜寻合适代码来复制粘贴的时间，同时它也提供给你一种最“正确”也最“方便”的创建新文件的方法。

Plop的核心其实主要是[inquirer](https://github.com/SBoudrias/Inquirer.js/)命令行工具和[handlebar](https://github.com/wycats/handlebars.js/)模板引擎的整合。



> 此文档还在编写中，如果你有什么好想法请联系我们。



## 安装

### 1. 将plop添加到项目

```
$ npm install --save-dev plop
```

### 2. 全局安装plop (可选项，推荐)

```
$ npm install -g plop
```

### 3. 在项目的根目录创建plopfile.js

```javascript
module.exports = function (plop) {
    // 创建生成器
    plop.setGenerator('basics', {
        description: '这是一个基础plopfile模板',
        prompts: [], // 确认问题数组
        actions: []  // 操作列表
    });
};
```

> `export default` 只可以被用在NodeJS下的支持“ESM”标准的文件中。如果你希望使用这种语法，请确保你的使用环境属于以下两种之一：
> 
> - 文件后缀名为.js，package.json的“type”字段中定义为“module”
> 
> - 文件后缀名为.mjs，此情况不限制package.json的“type”字段
> 
> 与此同时，你也可以创建一个内容为`module.exports = function (plop)`的`plopfile`。如果使用这种方式引入，需要你的使用环境属于以下两种之一：
> 
> - 文件后缀名为.js，package.json的“type”字段中定义为“commonjs”
> 
> - 文件后缀名为.js，此情况不限制package.json的“type”字段

## 编写Plopfile

Plopfile是一个简单的Node module，并导出一个函数，它接受一个`plop`对象作为第一个传入参数。

```javascript
module.exports = function (plop) {};
```

`plop`对象暴露了一些plop的api，其中包括`setGenerator(name, config)`方法，使用此方法可以创建Plop生成器。当在工作目录（或工作目录的子目录）命令行中输入`plop`命令时，所有的生成器会以列表形式输出。

一个最简单的起始生成器例子可能类似这样：

```javascript
module.exports = function (plop) {
    // controller generator
    plop.setGenerator('controller', {
        description: 'application controller logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'controller name please'
        }],
        actions: [{
            type: 'add',
            path: 'src/{{name}}.js',
            templateFile: 'plop-templates/controller.hbs'
        }]
    });
};
```

我们创建的 *controller* 生成器会询问我们一个问题，并创建一个文件。这一操作可以进一步扩展，比如询问更多的问题，创建更多的文件。也有一些附加的`action`可以通过其他的方式操作我们的代码仓库。

## 使用Prompts

Plop使用[inquirer.js](https://github.com/SBoudrias/Inquirer.js) 库来接受用户输入。更多关于[问题类型](https://github.com/SBoudrias/Inquirer.js/#prompt-types)的信息可以查看inquirer官方文档.

## 通过CLI调用

Plop成功安装并且创建了`generator`之后，你就可以使用命令行运行plop了。直接调用`plop`命令将会输出所有可用的生成器。你呀可以直接使用`plop [生成器名称]`来直接调用某一生成器。如果你没有全局安装plop，则需要编写一个npm脚本来帮助运行plop。

```javascript
// package.json
{
    ...,
    "scripts": {
        "plop": "plop"
    },
    ...
}
```

### 直接传入参数

如果你对一个项目（以及它的生成器）十分了解，你就可能希望在调用生成器时直接传递回答参数了。例如项目中有一个名为`component`的生成器，其接受一个名为`name`的参数，可以直接通过`plop component "名字"`直接传入参数。如果生成器接受更多参数，只要按照这种规则依次传入即可。

例如`confirm`和`list`类型的问题会最大程度尝试理解你的输入。比如为`confirm`类型问题传入参数"y"，"yes"，"t"，或者"true"都会被解析成布尔值`true`。同时你可以使用选项的确切值，数组下标，键名，或者名称等等表示从列表中选中某选项。多选问题允许你传入以逗号分隔的值的列表，来表示多选项。

#### 操作示例

![操作示例](https://i.loli.net/2021/02/20/TIA8zUY5NSBurXs.gif)



> 如果你想直接传入参数的问题是第二个问题，第一个仍需手动填写或选择，可以使用“\_“来跳过某个参数(例如 `plop component _ "input for second prompt"`).



Plop已经内置常规问题的直接传入参数逻辑了，不过你也可以自定义一些特殊问题解析用户输入的逻辑。如果你发布了inquirer的第三方插件并想支持plop的直接传入参数逻辑，可以查看[本文档的相关内容](#3rd-party-prompt-bypass).

### 通过属性名直接传入参数

你也可以直接传入参数 `--` 然后提供每个问题的参数来直接传入参数，例子[如下](#直接传入参数示例).

#### 直接传入参数示例

```
## 直接传入问题1和2的参数
$ plop component "my component" react
$ plop component -- --name "my component" --type react

## 直接传入问题2的参数 (name 属性依然会正常询问)
$ plop component _ react
$ plop component -- --type react
```

### 强制执行生成器

通常情况下Plop的`action`在发现执行可以操作时会执行失败，以此来尽可能确保文件安全。最常见的情况可能是不允许[`add`](#add) 操作覆盖一个已存在文件。但是Plop支持特殊的`force`属性，你也可以在命令行输入的指令后加上`--force`选项来开启强制模式，在这一模式下所有操作均会强制完成。不惜一切代价...🕷

## 为什么是“生成器”机制

这一机制可以使得你可以专注于编写模板，而不必同时考虑代码逻辑问题。这一机制可以为你和你的团队在面对重复逻辑时（路由，组件，辅助函数，测试，界面层，等等）节省大量的时间，[这真的很重要](https://xkcd.com/1205/)！

与此同时，对于程序猿来说在不同任务之间反复横跳真的[很浪费时间](https://www.petrikainulainen.net/software-development/processes/the-cost-of-context-switching/)，很有可能还没等你进入编写新逻辑的状态你就忍不住去摸鱼了...所以一次专注一件事真的可以大大提高工作效率！而且[工程化运作](https://kentcdodds.com/blog/automation)的优势远不止于此！



# Plopfile API

Plopfile api是一系列`plop`对象暴露出的方法，其实[`setGenerator`](#setgenerator)可以解决大部分的问题。但是在这部分文档中你可能会找到一些其他的有用信息以充实和完善你的plopfile。

## 使用TypeScript

`plop`内置了Typescript类型定义，无论你是否需要使用Typescript编写plopfile，这一特定都可以方便大部分的代码编辑器提供代码提示。

```javascript
// plopfile.ts

import { NodePlopAPI } from 'plop';



export default function (plop: NodePlopAPI) {

  // plop generator code

};
```

```javascript
// plopfile.js

module.exports = function (

  /** @type {import('plop').NodePlopAPI} */

  plop

) {

  // plop generator code

};
```

## 常用方法

这些是创建plopfile时常用的方法。其他主要供内部使用的方法在[其他方法](#其他方法)部分列出。

| 方法名                                                       | 入参                                                       | 返回值                                          | 描述                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| [**setGenerator**](#setgenerator)                            | String, [GeneratorConfig](#interface-generatorconfig)      | *[GeneratorConfig](#interface-generatorconfig)* | 创建一个生成器                                               |
| [**setHelper**](#sethelper)                                  | *String, Function*                                         |                                                 | 创建一个helper                                               |
| [**setPartial**](#setpartial)                                | *String, String*                                           |                                                 | 创建一个Partial                                              |
| [**setActionType**](#setactiontype)                          | *String, [CustomAction](#functionsignature-custom-action)* |                                                 | 创建一个Action类型                                           |
| [**setPrompt**](#setprompt)                                  | *String, InquirerPrompt*                                   |                                                 | 使用inquirer注册自定义问题类型                               |
| [**load**](https://github.com/amwmedia/plop/blob/master/plop-load.md) | *Array[String], Object, Object*                            |                                                 | 从另一plopfile或者 npm module中载入生成器，helper，和/或 partials |

## setHelper

`setHelper` 等同于 handlebars 的方法 `registerHelper`。 如果你熟悉 [handlebars helpers](https://handlebarsjs.com/guide/expressions.html#helpers)，那你就已经对此很熟悉了。

```javascript
export default function (plop) {
    plop.setHelper('upperCase', function (text) {
        return text.toUpperCase();
    });

    // or in es6/es2015
    plop.setHelper('upperCase', (txt) => txt.toUpperCase());
};

```

## setPartial

`setPartial` 等同于 handlebars 的方法 `registerPartial`。如果你熟悉 [handlebars partials](https://handlebarsjs.com/guide/partials.html)，那你就已经对此很熟悉了。

```javascript
export default function (plop) {
    plop.setPartial('myTitlePartial', '<h1>{{titleCase name}}</h1>');
    // used in template as {{> myTitlePartial }}
};

```

## setActionType

`setActionType`允许你创建自定义`actions` (类似 `add` 或 `modify`) 完善你的plopfile。这些方法通常都是高度可复用的的 [自定义函数](#自定义action方法)。

### *函数定义* 自定义Action

| 参数        | 类型                                      | 描述                        |
| ----------- | ----------------------------------------- | --------------------------- |
| **answers** | *Object*                                  | 生成器问题的回答            |
| **config**  | *[ActionConfig](#interface-actionconfig)* | 生成器“actions”数组中的对象 |
| **plop**    | *[PlopfileApi](#plopfile-api)*            | Action运作时的plop api      |

```javascript
export default function (plop) {
    plop.setActionType('doTheThing', function (answers, config, plop) {
        // do something
        doSomething(config.configProp);
        // if something went wrong
        throw 'error message';
        // otherwise
        return 'success status message';
    });

    // or do async things inside of an action
    plop.setActionType('doTheAsyncThing', function (answers, config, plop) {
        // do something
        return new Promise((resolve, reject) => {
            if (success) {
                resolve('success status message');
            } else {
                reject('error message');
            }
        });
    });

    // use the custom action
    plop.setGenerator('test', {
        prompts: [],
        actions: [{
            type: 'doTheThing',
            configProp: 'available from the config param'
        }, {
            type: 'doTheAsyncThing',
            speed: 'slow'
        }]
    });
};

```

## setPrompt

[Inquirer](https://github.com/SBoudrias/Inquirer.js) 提供了许多开箱即用的问题类型，但是其也允许开发者构建第三方插件丰富问题类型。如果你需要使用第三方问题差价插件，你可以使用`setPrompt`。更多细节可以查看[Inquirer关于注册问题的官方文档](https://github.com/SBoudrias/Inquirer.js#inquirerregisterpromptname-prompt)。 你也可以查看[plop社区提供的自定问题列表](https://github.com/amwmedia/plop/blob/master/inquirer-prompts.md).

```javascript
import autocompletePrompt from 'inquirer-autocomplete-prompt';
export default function (plop) {
    plop.setPrompt('autocomplete', autocompletePrompt);
    plop.setGenerator('test', {
        prompts: [{
            type: 'autocomplete',
            ...
        }]
    });
};

```

## setGenerator

这一部分的配置对象需要包含`prompts` 和 `actions`（`description`是可选项）。`Prompts`数组会被传递到[inquirer](https://github.com/SBoudrias/Inquirer.js/#objects)，`actions`数组是一系列将要进行的操作的数组。（详细文档参阅下文）

### *接口* `GeneratorConfig`

| 参数            | 类型                                                         | 默认值 | 描述                        |
| --------------- | ------------------------------------------------------------ | ------ | --------------------------- |
| **description** | *[String]*                                                   |        | 此生成器功能的简短描述 |
| **prompts**     | *Array[[InquirerQuestion](https://github.com/SBoudrias/Inquirer.js/#question)]* |        | 需要询问用户的问题          |
| **actions**     | *Array[[ActionConfig](#interface-actionconfig)]*             |        | 需要执行的操作              |

  >如果你的Action列表有动态需求，你可以查看[使用动态action数组](#using-a-dynamic-actions-array)部分内容。

### *接口* `ActionConfig`

下列参数是plop内部需要使用的基本参数，其他参数的需求取决于action的*类型*，关于这部分可以查看[内置actions](#built-in-actions)。

| 参数            | 类型                | 默认值  | 描述                                                         |
| --------------- | ------------------- | ------- | ------------------------------------------------------------ |
| **type**        | *String*            |         | action的类型 ([`add`](#add), [`modify`](#modify), [`addMany`](#addmany), [等等](#setactiontype)) |
| **force**       | *Boolean*           | `false` | 强制执行[forcefully](#running-a-generator-forcefully) (在不同action下有不同表现) |
| **data**        | *Object / Function* | `{}`    | 指定需要与用户输入参数进行合并的数据                         |
| **abortOnFail** | *Boolean*           | `true`  | 如果本操作因任何原因失败则取消后续操作                       |
| **skip**        | *Function*          |         | 可选项，标记这个action是否会被执行                           |

> `ActionConfig`的`data`属性也可以为一个返回对象的函数或者一个返回`resolve`内容为函数的`Promise`。

> `ActionConfig`的`skip`属性方法是可选项，其应该返回一个字符串，内容是逃过action执行的原因。

> `Action`除了可以使用对象写法，也可以使用[函数写法](#自定义action方法)

## 其他方法

| 方法                  | 参数             | 返回                                            | 描述                                                         |
| --------------------- | ---------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| **getHelper**         | *String*         | *Function*                                      | 获取helper函数                                               |
| **getHelperList**     |                  | *Array[String]*                                 | 获取helper函数名称列表                                       |
| **getPartial**        | *String*         | *String*                                        | 通过名称获取handlebars partial                               |
| **getPartialList**    |                  | *Array[String]*                                 | 获取partial名称列表                                          |
| **getActionType**     | *String*         | *[CustomAction](#函数定义-自定义action)*        | 通过名称获取action 类型                                      |
| **getActionTypeList** |                  | *Array[String]*                                 | 获取actionType名称列表                                       |
| **setWelcomeMessage** | *String*         |                                                 | 自定义运行`plop`时提示选择generator的提示标语                |
| **getGenerator**      | *String*         | *[GeneratorConfig](#interface-generatorconfig)* | 根据名称获取[GeneratorConfig](#interface-generatorconfig)    |
| **getGeneratorList**  |                  | *Array[Object]*                                 | 获取generator名称和描述的列表                                |
| **setPlopfilePath**   | *String*         |                                                 | 更改内部用于定位资源和模板文件的`plopfilePath`值             |
| **getPlopfilePath**   |                  | *String*                                        | 返回plopfile的绝对路径                                       |
| **getDestBasePath**   |                  | *String*                                        | 获取创建文件的基准路径                                       |
| **setDefaultInclude** | *Object*         | *Object*                                        | 设置当被其他文件使用 `plop.load()`载入时的默认设置           |
| **getDefaultInclude** | *String*         | *Object*                                        | 获取当被其他文件使用 `plop.load()`载入时的默认设置           |
| **renderString**      | *String, Object* | *String*                                        | 使用handlebars渲染第一个参数(*String*)的模板，第二个参数(*Object*)作为渲染模板的数据 |

# 内置actions

你可以在[GeneratorConfig](#接口-generatorconfig)中通过设置action的`type`属性以及模板名称(路径均为plopfile的相对路径)来使用内置的action。

>`Add`, `AddMany`和`Modify`actions有一个可选方法`transform`，它可以在模板渲染结果被写入文件之前对结果做出修改。`transform`方法接受字符串类型的文件内容或许安然结果作为参数，同时必须返回一个字符串或者字符串Promise。

## Add
正如其字面意思，`add`action会想你的项目中添加一个问题件。Path参数将会被传入handlebars作为渲染的目标文件名字。文件内容则取决于`template`或 `templateFile` 属性。

属性 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**path** | *String* | | 渲染结果的目标位置
**template** | *String* | | 渲染使用的模板名称
**templateFile** | *String* | | 使用的模板路径
**skipIfExists** | *Boolean* | `false` | 当文件已经存在的时候直接跳过（而不是失败）
**transform** | *Function* | | [可选方法](#内置actions)，可以在内容被写入文件之前做出修改
**skip** | *Function* | | *继承自 [ActionConfig](#接口-actionconfig)*
**force** | *Boolean* | `false` | *继承自 [ActionConfig](#接口-actionconfig)* (如果文件存在将直接覆盖)
**data** | *Object* | `{}` | *继承自 [ActionConfig](#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](#接口-actionconfig)*

## AddMany

`addMany`action可以在一个action中向项目添加多个文件。`destination`属性为生成文件的目标文件夹，`base`属性可以用于更改创建文件时需要忽略的文件路径。如果你需要生成特定文件名的文件，你可以在`templateFiles`属性处使用handlebars语法，例如“` { { dashCase name } }.spec.js `”

属性 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**destination** | *String* | | 渲染结果文件的目标文件夹
**base** | *String* | | 向destination中写入文件时排除的文件路径
**templateFiles** | *[Glob](https://github.com/sindresorhus/globby#globbing-patterns)* | | 用于匹配需要添加的模板
**stripExtensions** | *[String]* | `['hbs']` | 模板文件的后缀名
**globOptions** | *[Object](https://github.com/sindresorhus/globby#options)* | | 改变模板文件匹配方法的glob选项
**verbose** | *Boolean* | `true` | 输出成功添加的文件路径
**transform** | *Function* | | [可选方法](#内置actions)，可以在内容被写入文件之前做出修改
**skip** | *Function* | | *继承自 [ActionConfig](#接口-actionconfig)*
**skipIfExists** | *Boolean* | `false` | *继承自[Add](#add)* 当文件已经存在的时候直接跳过（而不是失败）
**force** | *Boolean* | `false` | *继承自 [ActionConfig](#接口-actionconfig)* (如果文件存在将直接覆盖)
**data** | *Object* | `{}` | *继承自 [ActionConfig](#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](#接口-actionconfig)*

## Modify

`modify`action有两种使用方法，你可以使用`pattern`属性来匹配并替换在`path`中指定的文件，同时你可以使用`transform`方法来修改文件内容。`pattern`和 `transform`可以同时使用（`transform`后执行）。更多细节可以查看官方example

属性 | 类型 | 默认值 | 描述
-------- | ---- | ------- | -----------
**path** | *String* | | 需要被修改的文件渲染时使用的handlebars模板
**pattern** | *RegExp* | _end&#x2011;of&#x2011;file_ | 用以匹配和替换的正则表达式
**template** | *String* | | 模板中需要被匹配替换的内容，可以使用```$1```， ```$2```等等作为占位符
**templateFile** | *String* | | 包含`template`的文件路径
**transform** | *Function* | | [可选方法](#内置actions)，可以在内容被写入文件之前做出修改
**skip** | *Function* | | *继承自 [ActionConfig](#接口-actionconfig)*
**data** | *Object* | `{}` | *继承自 [ActionConfig](#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](#接口-actionconfig)*

## Append
`append` action 是更常用的`modify`的子集。 他可以在文件的特定位置插入内容。

属性 | 类型 | 默认值 | 描述
-------- | ------ | ------- | -----------
**path** | *String* | | 需要被修改的文件渲染时使用的handlebars模板
**pattern** | *RegExp, String* | | 用以匹配和替换的正则表达式
**unique** | *Boolean* | `true` | 相同内容是否需要被移除
**separator** | *String* | `new line` | 分隔条目的值
**template** | *String* | | 需要被修改的文件渲染时使用的handlebars模板
**templateFile** | *String* | | 包含`template`的文件路径
**data** | *Object* | `{}` | *继承自 [ActionConfig](#接口-actionconfig)*
**abortOnFail** | *Boolean* | `true` | *继承自 [ActionConfig](#接口-actionconfig)*

>此处文档翻译有待推敲，欢迎提出pr进行修正和补充

## Custom (Action Function)
`Add`和`Modify`几乎可以完成plop设计的所有功能，不过plop也提供了更加进阶的自定义action方法。在actions数组中填入自定义的action函数即可使用这一功能。
- 自行以action在执行时与官方action使用相同的[函数接口](#函数定义-自定义action)
- Plop会等待自定义action方法执行完毕后才会继续执行下一个action
- 函数必须返回一个Plop可以理解的确切值，如果返回了一个`promise`，那么在这个promise完成之前plop不会进行任何操作。如果函数返回了一个字符串类型的消息(*String*)， plop便可得知action已经成功执行，并将此信息输出到action的状态提示信息上。
- 当返回的promise被reject，会程序抛出了一个异常，plop会视为action执行失败

_你也可以查看官方提供的 [同步自定义action案例](https://github.com/amwmedia/plop/blob/master/example/plopfile.js)_

## Comments
通过添加一个字符串来代替 action config 对象，可以将注释行添加到 actions 数组中。当plop执行这一action时，注释就会被打印到屏幕上，这一action本身不会进行其他任何操作。

# 内置 Helper

这些Helper应该可以覆盖你使用plop的所有需要，其中大部分是格式转换器，以下是内置Helper完整列表


## 格式转换器
- **camelCase**: changeFormatToThis
- **snakeCase**: change_format_to_this
- **dashCase/kebabCase**: change-format-to-this
- **dotCase**: change.format.to.this
- **pathCase**: change/format/to/this
- **properCase/pascalCase**: ChangeFormatToThis
- **lowerCase**: change format to this
- **sentenceCase**: Change format to this
- **constantCase**: CHANGE_FORMAT_TO_THIS
- **titleCase**: Change Format To This

## 其他 Helper
- **pkg**: 在plopfile同文件夹下的packag.json中寻找某一属性

# 进阶使用

以下是一些常见的进阶用法

## 使用动态构建的actions数组
[GeneratorConfig](#接口-generatorconfig)的`actions`属性可以是一个函数，他接受answers作为传入参数并且返回actions数组，这使你可以根据输入的答案动态调整actions数组

``` javascript
module.exports = function (plop) {
  plop.setGenerator('test', {
    prompts: [{
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

## 向社区第三方Prompt直接传入数据

如果你编写了一个inquirer问题插件，并想要提供plop支持，实现起来很简单。你只需要为你的问题插件导出对象添加一个`bypass`方法。这一方法会被plop执行，执行时传入的第一个参数为用户的输入，第二个参数为prompt设置对象。这个函数的返回值会被作为该问题的答案保存到data对象中。

``` javascript
// My confirmation inquirer plugin
module.exports = MyConfirmPluginConstructor;
function MyConfirmPluginConstructor() {
  // ...your main plugin code
  this.bypass = (rawValue, promptConfig) => {
    const lowerVal = rawValue.toString().toLowerCase();
    const trueValues = ['t', 'true', 'y', 'yes'];
    const falseValues = ['f', 'false', 'n', 'no'];
    if (trueValues.includes(lowerVal)) return true;
    if (falseValues.includes(lowerVal)) return false;
    throw Error(`"${rawValue}" is not a valid ${promptConfig.type} value`);
  };
  return this;
}
```
> 在这个案例中，函数将用户输入解析为布尔值并存入data对象中

### 直接在plopfile中提供直接传入参数支持
如果你的第三方插件不支持直接传入参数，你可以直接在你的问题设置对象中加入`bypass`方法，plop会自动将其用于解析参数。

## 对Plop进行包装

Plop额外提供了很多非常强大的功能，你甚至可以基于这些功能对`plop`进行进一步的包装，将其打包成你自己的cli。你只需要一个`plopfile.js`，一个`package.json`，和一个用于参考的模板文件。

你可以这样编写你的`index.js`:

```javascript
#!/usr/bin/env node
const path = require('path');
const args = process.argv.slice(2);
const { Plop, run } = require('plop');
const argv = require('minimist')(args);

Plop.launch({
  cwd: argv.cwd,
  // In order for `plop` to always pick up the `plopfile.js` despite the CWD, you must use `__dirname`
  configPath: path.join(__dirname, 'plopfile.js'),
  require: argv.require,
  completion: argv.completion
// This will merge the `plop` argv and the generator argv.
// This means that you don't need to use `--` anymore
}, env => run(env, undefined, true));
```

> 如果你选择了`env => run(env, undefined, true))`写法，你可能会在直接传入参数时
>遇到指令执行问题
>
> 如果你想放弃使用这一特性而使用类似plop使用的方法 (需要在向generator传入参数之前加上`--`)
> 只要将箭头函数`env =>`替换成`run`即可:
>
>```javascript
>Plop.launch({}, run);
>```

你的 `package.json` 可能将会类似如下格式:

```json
{
  "name": "create-your-name-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "plop",
  },
  "bin": {
    "create-your-name-app": "./index.js"
  },
  "preferGlobal": true,
  "dependencies": {
    "plop": "^2.6.0"
  }
}
```

### 为你的自定义程序设定基准路径

当进一步打包plop时，你可能需要基于命令行执行cwd生成目标路径，你可以这样设置基准路径`dest`：


```javascript
Plop.launch({
  // config like above
}, env => {
  const options = {
    ...env,
    dest: process.cwd() // this will make the destination path to be based on the cwd when calling the wrapper
  }
  return run(options, undefined, true)
})
```

### 添加自动CLI Actions

许多CLI都会自动帮你进行某些行为，比如说在项目生成完成后自动运行 `git init` 或 `npm install`

这些行为非常普遍，但是我们出于保持核心功能简洁的目的并没有默认添加它们。因此，我们维护了一个 [库集合](https://github.com/plopjs/awesome-plop)，用于将这些行为添加到[our Awesome Plop list](https://github.com/plopjs/awesome-plop)中，在那里，您可以找到这些行为，甚至可以构建自己的行为并将其添加到列表中！。

### 更加进阶的自定义

虽然`plop`已经提供了高度可自定义的CLI包装支持，但也有可能某些场景下你需要在借助模板代码生成功能的基础上更进一步的掌控CLI的工作体验。

幸运的是， [`node-plop`](https://github.com/plopjs/node-plop/) 可能更适合你! `plop` CLI本身就是基于此构建的，你可以基于此构建其他功能更加丰富的CLI。只是这部分的文档可能有待更进一步的完善，不过风险往往与机会并存 :)

>我们注意到关于`node-plop` 集成的乏善可陈的文档可能是我们的一项短板。如果您希望为项目贡献文档，欢迎您积极参与进来！
