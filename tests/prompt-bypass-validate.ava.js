import AvaTest from './_base-ava-test';
import promptBypass from '../lib/prompt-bypass';

const {test, nodePlop} = (new AvaTest(__filename));
const plop = nodePlop();

const prompts = [{
	type:'input', name:'input', message:'inputMsg',
	validate: (value) => value === 'invalid' ? 'Is invalid' : true
}];

test('verify valid bypass input', function (t) {
	const [, isValid] = promptBypass(prompts, ['valid'], plop);
	t.is(isValid.input, 'valid');
});

test('verify bad bypass input', function (t) {
	t.throws(() => promptBypass(prompts, ['invalid'], plop));
});