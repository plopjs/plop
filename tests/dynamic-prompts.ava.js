import co from 'co';
import AvaTest from './_base-ava-test';
const {test, mockPath, nodePlop} = (new AvaTest(__filename));

let plop, dynamicPrompts;

test.before(() => {
	plop = nodePlop(`${mockPath}/plopfile.js`);
	dynamicPrompts = plop.getGenerator('dynamic-prompt');
});

test('If prompt is provided as a function, runPrompts() should call it', co.wrap(function* (t) {
	const result = yield dynamicPrompts.runPrompts();
	t.true(result.promptFunctionCalled);
}));

test('If prompt is provided as a function, runPrompts() should cbe called with inquirer instance', co.wrap(function* (t) {
	const result = yield dynamicPrompts.runPrompts();
	t.is(result.promptArgs[0], plop.inquirer);
}));