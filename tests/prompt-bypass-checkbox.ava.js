import AvaTest from './_base-ava-test.js';
import promptBypass from '../src/prompt-bypass.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const {test, nodePlop} = (new AvaTest(__filename));


var plop;
test.before(async () => {
	plop = await nodePlop();
});


const prompts = [{
	type:'checkbox', name:'checkbox', message:'checkboxMsg',
	choices: [
		'one',
		{key: 't', value:'two'},
		{name: 'three'}
	]
}];

test('verify good bypass input', async function (t) {
	const [, allAnswersByValue] = await promptBypass(prompts, ['one,two,three'], plop);
	t.true(Array.isArray(allAnswersByValue.checkbox));
	t.is(JSON.stringify(allAnswersByValue.checkbox), '["one","two","three"]');

	const [, someAnswersByValue] = await promptBypass(prompts, ['one,three'], plop);
	t.true(Array.isArray(someAnswersByValue.checkbox));
	t.is(JSON.stringify(someAnswersByValue.checkbox), '["one","three"]');

	const [, allAnswersByIndex] = await promptBypass(prompts, ['0,1,2'], plop);
	t.true(Array.isArray(allAnswersByIndex.checkbox));
	t.is(JSON.stringify(allAnswersByIndex.checkbox), '["one","two","three"]');

	const [, someAnswersByIndex] = await promptBypass(prompts, ['0,2'], plop);
	t.true(Array.isArray(someAnswersByIndex.checkbox));
	t.is(JSON.stringify(someAnswersByIndex.checkbox), '["one","three"]');

	const [, allAnswersByMixed] = await promptBypass(prompts, ['0,t,three'], plop);
	t.true(Array.isArray(allAnswersByMixed.checkbox));
	t.is(JSON.stringify(allAnswersByMixed.checkbox), '["one","two","three"]');

	const [, someAnswersByMixed] = await promptBypass(prompts, ['0,three'], plop);
	t.true(Array.isArray(someAnswersByMixed.checkbox));
	t.is(JSON.stringify(someAnswersByMixed.checkbox), '["one","three"]');
});

test('verify bad bypass input', async function (t) {
	await t.throwsAsync(() => promptBypass(prompts, ['one,four'], {is: plop}));
	await t.throwsAsync(() => promptBypass(prompts, ['four'], {is: plop}));
	await t.throwsAsync(() => promptBypass(prompts, ['3'], {is: plop}));
});
