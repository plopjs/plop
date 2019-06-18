import AvaTest from './_base-ava-test';
import promptBypass from '../lib/prompt-bypass';

const {test, nodePlop} = (new AvaTest(__filename));
const plop = nodePlop();

const prompts = [{
	type:'list',
	name:'list', message:'listMsg',
	choices: [
		'eh',
		{key: 'b', value:'bee'},
		{name: 'c', value: 'see'},
		{value: 'd'},
		{name: 'e'}
	]
}];

test('verify good bypass input', function (t) {
	const [, byValue] = promptBypass(prompts, ['eh'], plop);
	t.is(byValue.list, 'eh');

	const [, byKey] = promptBypass(prompts, ['b'], plop);
	t.is(byKey.list, 'bee');

	const [, byName] = promptBypass(prompts, ['c'], plop);
	t.is(byName.list, 'see');

	const [, byValueProp] = promptBypass(prompts, ['d'], plop);
	t.is(byValueProp.list, 'd');

	const [, byNameNoValue] = promptBypass(prompts, ['e'], plop);
	t.is(byNameNoValue.list, 'e');

	const [, byIndexValue] = promptBypass(prompts, ['0'], plop);
	t.is(byIndexValue.list, 'eh');

	const [, byIndexKey] = promptBypass(prompts, ['1'], plop);
	t.is(byIndexKey.list, 'bee');

	const [, byIndexName] = promptBypass(prompts, ['2'], plop);
	t.is(byIndexName.list, 'see');

	const [, byIndexValueProp] = promptBypass(prompts, ['3'], plop);
	t.is(byIndexValueProp.list, 'd');

	const [, byIndexNameNoValue] = promptBypass(prompts, ['4'], plop);
	t.is(byIndexNameNoValue.list, 'e');

	const [, byIndexNumber] = promptBypass(prompts, [4], plop);
	t.is(byIndexNumber.list, 'e');
});

test('verify bad bypass input', function (t) {
	t.throws(() => promptBypass(prompts, ['asdf'], plop));
	t.throws(() => promptBypass(prompts, ['5'], plop));
});
