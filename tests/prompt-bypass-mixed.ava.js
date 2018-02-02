import AvaTest from './_base-ava-test';
import promptBypass from '../lib/prompt-bypass';

const {test, nodePlop} = (new AvaTest(__filename));
const plop = nodePlop();

const prompts = [
	{ type:'list', name:'list', message:'listMsg', choices: ['a','B','c'] },
	{ type:'input', name:'input', message:'inputMsg' },
	{ type:'input', name:'filter', message:'filterMsg', filter: () => 'filter applied' },
	{ type:'input', name:'conditional', message:'conditionalMsg', when: () => false }
];

test('verify good bypass input', function (t) {
	const [promptsAfterBypassOne, bypassOne] = promptBypass(prompts, ['0'], plop);
	t.is(bypassOne.list, 'a');
	t.is(promptsAfterBypassOne.length, 4);
	t.is(promptsAfterBypassOne[0].type, undefined);

	const [promptsAfterBypassTwo, bypassTwo] = promptBypass(prompts, ['b', 'something'], plop);
	t.is(bypassTwo.list, 'B');
	t.is(bypassTwo.input, 'something');
	t.is(promptsAfterBypassTwo.length, 3);

	const [promptsAfterBypassThree, bypassThree] = promptBypass(prompts, ['b', 'something', 'something filtered'], plop);
	t.is(bypassThree.list, 'B');
	t.is(bypassThree.input, 'something');
	t.is(bypassThree.filter, 'filter applied');
	t.is(promptsAfterBypassThree.length, 2);
});

test('verify bad bypass input', function (t) {
	// can't bypass conditional prompts
	t.throws(() => promptBypass(prompts, ['a', 'something', 'something filtered', 'something else'], plop));
});
