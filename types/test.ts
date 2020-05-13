import nodePlop from './index';

const plop = nodePlop('./file', {
	destBasePath: './',
	force: false,
});

const generators = plop.getGeneratorList();

const names = generators.map((v) => v.name);

const generator = plop.getGenerator(names[0]);

plop.getWelcomeMessage();

// $ExpectError
plop.test();

generator.runPrompts(['test']).then((answers) => {
	const onComment = (): void => {
		console.log('Start');
	};
	const onSuccess = (): void => {
		console.log('This worked!');
	};
	const onFailure = (): void => {
		console.log('Failed');
	};
	return generator.runActions(answers, { onSuccess, onFailure, onComment }).then(() => {
		console.log('Done');
	});
});
