import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

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
