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
	type:'list',
	name:'list',
	message:'listMsg',
	choices: [
		'eh',
		{key: 'b', value:'bee'},
		{name: 'c', value: 'see'},
		{value: 'd'},
		{name: 'e'},
		{key: 'f', name: 'ff', value: { prop: 'value'}}
	]
}];

test('verify good bypass input', async function (t) {
	const [, byValue] = await promptBypass(prompts, ['eh'], plop);
	t.is(byValue.list, 'eh');

	const [, byKey] = await promptBypass(prompts, ['b'], plop);
	t.is(byKey.list, 'bee');

	const [, byName] = await promptBypass(prompts, ['c'], plop);
	t.is(byName.list, 'see');

	const [, byValueProp] = await promptBypass(prompts, ['d'], plop);
	t.is(byValueProp.list, 'd');

	const [, byNameNoValue] = await promptBypass(prompts, ['e'], plop);
	t.is(byNameNoValue.list, 'e');

	const [, byIndexValue] = await promptBypass(prompts, ['0'], plop);
	t.is(byIndexValue.list, 'eh');

	const [, byIndexKey] = await promptBypass(prompts, ['1'], plop);
	t.is(byIndexKey.list, 'bee');

	const [, byIndexName] = await promptBypass(prompts, ['2'], plop);
	t.is(byIndexName.list, 'see');

	const [, byIndexValueProp] = await promptBypass(prompts, ['3'], plop);
	t.is(byIndexValueProp.list, 'd');

	const [, byIndexNameNoValue] = await promptBypass(prompts, ['4'], plop);
	t.is(byIndexNameNoValue.list, 'e');

	const [, byIndexNumber] = await promptBypass(prompts, [4], plop);
	t.is(byIndexNumber.list, 'e');

	const [, byIndexNumberObject] = await promptBypass(prompts, [5], plop);
	t.deepEqual(byIndexNumberObject.list, { prop: 'value' });

	const [, byKeyObject] = await promptBypass(prompts, 'f', plop);
	t.deepEqual(byKeyObject.list, { prop: 'value' });

	const [, byNameObject] = await promptBypass(prompts, 'ff', plop);
	t.deepEqual(byNameObject.list, { prop: 'value' });
});

test('verify bad bypass input', async function (t) {
	await t.throwsAsync(() => promptBypass(prompts, ['asdf'], {is: plop}));
	await t.throwsAsync(() => promptBypass(prompts, ['6'], {is: plop}));
	await t.throwsAsync(() => promptBypass(prompts, [6], {is: plop}));
});
