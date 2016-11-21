import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, nodePlop} = (new AvaTest(__filename));
const packModuleName = 'plop-pack-fancy-comments';
const plopfilePath = path.join(mockPath, 'plopfile.js');

/////
// test the various ways to import all or part of a node module
//

test('plop.load should use the default include definition set by the pack', function (t) {
	const plop = nodePlop();
	plop.load(packModuleName);

	t.true(plop.getHelperList().includes('js-multi-line-header'));
	t.is(plop.getGeneratorList().length, 0);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should include all generators by default', function (t) {
	const plop = nodePlop();
	plop.load([packModuleName], {prefix: 'html-'});

	t.true(plop.getHelperList().includes('html-multi-line-header'));
	t.is(plop.getGeneratorList().length, 0);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should work with mixed types (packs and files)', function (t) {
	const plop = nodePlop();
	plop.load([packModuleName, plopfilePath]);

	t.true(plop.getHelperList().includes('js-multi-line-header'));
	t.is(plop.getGeneratorList().length, 3);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should allow consumer to override config', function (t) {
	const plop = nodePlop();
	plop.load([packModuleName, plopfilePath], {prefix: 'test-'});

	t.true(plop.getHelperList().includes('test-multi-line-header'));
	t.true(plop.getGeneratorList().map(g => g.name).includes('test-generator1'));
	t.is(plop.getGeneratorList().length, 3);
	t.true(plop.getHelperList().length > 0);
	t.is(plop.getPartialList().length, 0);
});

test('plop.load should allow consumer to override include definition', function (t) {
	const plop = nodePlop();
	plop.load([packModuleName, plopfilePath], null, {helpers: true});

	t.is(plop.getGeneratorList().length, 0);
	t.true(plop.getHelperList().length > 0);
	t.true(plop.getHelperList().includes('js-multi-line-header'));
	t.is(plop.getPartialList().length, 0);
});
