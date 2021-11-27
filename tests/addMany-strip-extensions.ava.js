import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);

const { test, mockPath, testSrcPath, nodePlop } = (new AvaTest(__filename));

var plop;
var multipleAdds;
test.before(async () => {
	plop = await nodePlop(`${mockPath}/plopfile.js`);
	multipleAdds = plop.getGenerator('add-many-strip-extensions');
	await multipleAdds.runActions({ name: 'John Doe' });
});

test('Check that all files generated without hbs extension', t => {
	const nonSpecPath = path.resolve(testSrcPath, 'remove-hbs/john-doe-my-view.js')
	const specPath = path.resolve(testSrcPath, 'remove-hbs/john-doe-my-view.spec.js')

	t.true(fs.existsSync(nonSpecPath), `Can't resolve ${nonSpecPath}`);
	t.true(fs.existsSync(specPath), `Can't resolve ${specPath}`);
});

test('Check that all files generated with all extensions removed', t => {
	const nonSpecPath = path.resolve(testSrcPath, 'remove-all/my-view.spec')
	const specPath = path.resolve(testSrcPath, 'remove-all/my-view.spec.js')

	t.true(fs.existsSync(nonSpecPath), `Can't resolve ${nonSpecPath}`);
	t.true(fs.existsSync(specPath), `Can't resolve ${specPath}`);
});
