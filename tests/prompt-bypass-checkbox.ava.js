import AvaTest from './_base-ava-test';
import promptBypass from '../lib/prompt-bypass';

const {test, nodePlop} = (new AvaTest(__filename));
const plop = nodePlop();

const prompts = [{
	type:'checkbox', name:'checkbox', message:'checkboxMsg',
	choices: [
		'one',
		{key: 't', value:'two'},
		{name: 'three'}
	]
}];

test('verify good bypass input', function (t) {
	const [, allAnswersByValue] = promptBypass(prompts, ['one,two,three'], plop);
	t.true(Array.isArray(allAnswersByValue.checkbox));
	t.is(JSON.stringify(allAnswersByValue.checkbox), '["one","two","three"]');

	const [, someAnswersByValue] = promptBypass(prompts, ['one,three'], plop);
	t.true(Array.isArray(someAnswersByValue.checkbox));
	t.is(JSON.stringify(someAnswersByValue.checkbox), '["one","three"]');

	const [, allAnswersByIndex] = promptBypass(prompts, ['0,1,2'], plop);
	t.true(Array.isArray(allAnswersByIndex.checkbox));
	t.is(JSON.stringify(allAnswersByIndex.checkbox), '["one","two","three"]');

	const [, someAnswersByIndex] = promptBypass(prompts, ['0,2'], plop);
	t.true(Array.isArray(someAnswersByIndex.checkbox));
	t.is(JSON.stringify(someAnswersByIndex.checkbox), '["one","three"]');

	const [, allAnswersByMixed] = promptBypass(prompts, ['0,t,three'], plop);
	t.true(Array.isArray(allAnswersByMixed.checkbox));
	t.is(JSON.stringify(allAnswersByMixed.checkbox), '["one","two","three"]');

	const [, someAnswersByMixed] = promptBypass(prompts, ['0,three'], plop);
	t.true(Array.isArray(someAnswersByMixed.checkbox));
	t.is(JSON.stringify(someAnswersByMixed.checkbox), '["one","three"]');
});

test('verify bad bypass input', function (t) {
	t.throws(() => promptBypass(prompts, ['one,four'], plop));
	t.throws(() => promptBypass(prompts, ['four'], plop));
	t.throws(() => promptBypass(prompts, ['3'], plop));
});
