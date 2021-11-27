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
	type:'input', name:'input', message:'inputMsg',
	validate: (value) => value === 'invalid' ? 'Is invalid' : true
}, {
	type:'input', name:'dependent-input', message:'dependent-inputMsg'
}];

test('verify valid bypass input', async function (t) {
	const [, isValid] = await promptBypass(prompts, ['valid'], plop);
	t.is(isValid.input, 'valid');
});

test('verify valid bypass input with access to answers', async function (t) {
	const promptsCopy = [...prompts];
	promptsCopy[1].validate = (value, answers) => {
		t.is(answers.input, 'valid');
		return !!value;
	};
	const [, isValid] = await promptBypass(promptsCopy, ['valid', 'also valid'], plop);
	t.is(isValid.input, 'valid');
	t.is(isValid['dependent-input'], 'also valid');
});


test('verify valid bypass async input with access to answers', async function (t) {
	const promptsCopy = [...prompts];
	promptsCopy[1].validate = async (value, answers) => {
		t.is(answers.input, 'valid');
		return !!value;
	};
	const [, isValid] = await promptBypass(promptsCopy, ['valid', 'also valid'], plop);
	t.is(isValid.input, 'valid');
	t.is(isValid['dependent-input'], 'also valid');
});

test('verify bad bypass input', async function (t) {
	await t.throwsAsync(() => promptBypass(prompts, ['invalid'], {is: plop}));
});
