import AvaTest from './_base-ava-test';
const {test, mockPath, nodePlop} = (new AvaTest(__filename));

let plop, dynamicPrompts;

test.before(() => {
	plop = nodePlop(`${mockPath}/plopfile.js`);
	dynamicPrompts = plop.getGenerator('dynamic-prompt');
});

test('If prompt is provided as a function, runPrompts() should call it', async function (t) {
	const result = await dynamicPrompts.runPrompts();
	t.true(result.promptFunctionCalled);
});

test('If prompt is provided as a function, runPrompts() should be called with inquirer instance', async function (t) {
	const result = await dynamicPrompts.runPrompts();
	t.is(result.promptArgs[0], plop.inquirer);
});

test('Prompt can be a function that syncronously returns answers', async function (t) {
	const dynPromptSync = plop.setGenerator('dynamic-prompt-sync', {
		prompts: () => ({ promptFunctionCalled: true })
	});
	const result = await dynPromptSync.runPrompts();
	t.true(result.promptFunctionCalled);
});
