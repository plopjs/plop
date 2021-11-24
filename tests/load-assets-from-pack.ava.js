import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, mockPath, nodePlop} = (new AvaTest(__filename));
const packModuleName = 'plop-pack-fancy-comments';
const plopfilePath = path.join(mockPath, 'plopfile.js');

/////
// test the various ways to import all or part of a node module
//

test('plop.load should use the default include definition set by the pack', async function (t) {
	const plop = await nodePlop();
	await plop.load(packModuleName);

	t.true(plop.getHelperList().includes('js-multi-line-header'));
	t.is(plop.getGeneratorList().length, 0);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should include all generators by default', async function (t) {
	const plop = await nodePlop();
	await plop.load([packModuleName], {prefix: 'html-'});

	t.true(plop.getHelperList().includes('html-multi-line-header'));
	t.is(plop.getGeneratorList().length, 0);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should work with mixed types (packs and files)', async function (t) {
	const plop = await nodePlop();
	await plop.load([packModuleName, plopfilePath]);

	t.true(plop.getHelperList().includes('js-multi-line-header'));
	t.is(plop.getGeneratorList().length, 3);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should allow consumer to override config', async function (t) {
	const plop = await nodePlop();
	await plop.load([packModuleName, plopfilePath], {prefix: 'test-'});

	t.true(plop.getHelperList().includes('test-multi-line-header'));
	t.true(plop.getGeneratorList().map(g => g.name).includes('test-generator1'));
	t.is(plop.getGeneratorList().length, 3);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should allow consumer to override include definition', async function (t) {
	const plop = await nodePlop();
	await plop.load([packModuleName, plopfilePath], null, {helpers: true});

	t.is(plop.getGeneratorList().length, 0);
	t.true(plop.getHelperList().length > 0);
	t.true(plop.getHelperList().includes('js-multi-line-header'));
	t.is(plop.getPartialList().length, 0);
});
