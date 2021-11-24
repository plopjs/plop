import AvaTest from './_base-ava-test.js';
import promptBypass from '../src/prompt-bypass.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, nodePlop} = (new AvaTest(__filename));
const plop = await nodePlop();

const prompts = [
	{ type:'list', name:'list', message:'listMsg', choices: ['a','B','c'] },
	{ type:'input', name:'input', message:'inputMsg' },
	{ type:'input', name:'filter', message:'filterMsg', filter: () => 'filter applied' },
	{ type:'input', name:'filter2', message:'filterMsg2', filter: () => 't needed' },
	{ type:'input', name:'conditional', message:'conditionalMsg', when: () => false }
];

test('verify good bypass input', function (t) {
	const [promptsAfterBypassOne, bypassOne] = promptBypass(prompts, ['0'], plop);
	t.is(bypassOne.list, 'a');
	t.is(promptsAfterBypassOne.length, 5);
	t.is(promptsAfterBypassOne[0].type, undefined);

	const [promptsAfterBypassTwo, bypassTwo] = promptBypass(prompts, ['b', 'something'], plop);
	t.is(bypassTwo.list, 'B');
	t.is(bypassTwo.input, 'something');
	t.is(promptsAfterBypassTwo.length, 4);

	const [promptsAfterBypassThree, bypassThree] = promptBypass(prompts, ['b', 'something', 'something filtered'], plop);
	t.is(bypassThree.list, 'B');
	t.is(bypassThree.input, 'something');
	t.is(bypassThree.filter, 'filter applied');
	t.is(promptsAfterBypassThree.length, 3);

	//check correct parameters passed to inquirer function
	prompts[3].filter = (input, answers) => {
		t.is(input, 'unimportant');
		t.is(answers.list, 'B');
		t.is(answers.input, 'something');
		t.is(answers.filter, 'filter applied');
		return answers.list;
	};
	const [promptsAfterBypassFour, bypassFour] =
		promptBypass(prompts, ['b', 'something', 'something filtered', 'unimportant'], plop);
	t.is(bypassFour.list, 'B');
	t.is(bypassFour.input, 'something');
	t.is(bypassFour.filter, 'filter applied');
	t.is(bypassFour.filter2, 'B');
	t.is(promptsAfterBypassFour.length, 2);
});

test('verify bad bypass input', function (t) {
	// can't bypass conditional prompts
	t.throws(() => promptBypass(prompts, ['a', 'something', 'something filtered', 'unimportant', 'something else'], {is: plop}));
});
