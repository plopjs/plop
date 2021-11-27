import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

var plop;
test.before(async () => {
	plop = await nodePlop();
});

/////
//
//

test('Add action does not fail on binary file', async function (t) {
	plop.setGenerator('addBinary', {
		actions: [{
			type: 'add',
			path: `${testSrcPath}/{{dashCase name}}-plop-logo.png`,
			templateFile: `${mockPath}/plop-logo.png`
		}]
	});

	const filePath = path.resolve(testSrcPath, 'test-plop-logo.png');
	await plop.getGenerator('addBinary').runActions({name: 'test'});
	t.true(fs.existsSync(filePath));
});
