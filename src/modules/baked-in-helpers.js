import changeCase from 'change-case';

export default {
	camelCase: changeCase.camel,
	snakeCase: changeCase.snake,
	dashCase: changeCase.param,
	kabobCase: changeCase.param,
	dotCase: changeCase.dot,
	pathCase: changeCase.path,
	properCase: changeCase.pascal,
	pascalCase: changeCase.pascal,
	lowerCase: changeCase.lower,
	sentenceCase: changeCase.sentence,
	constantCase: changeCase.constant,
	titleCase: changeCase.title
};
