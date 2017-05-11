import changeCase from 'change-case';

export default {
	camelCase: changeCase.camel,
	snakeCase: changeCase.snake,
	dotCase: changeCase.dot,
	pathCase: changeCase.path,
	lowerCase: changeCase.lower,
	upperCase: changeCase.upper,
	sentenceCase: changeCase.sentence,
	constantCase: changeCase.constant,
	titleCase: changeCase.title,

	dashCase: changeCase.param,
	kabobCase: changeCase.param,
	kebabCase: changeCase.param,

	properCase: changeCase.pascal,
	pascalCase: changeCase.pascal
};
