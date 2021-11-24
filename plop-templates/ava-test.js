import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
import AvaTest from './_base-ava-test.js';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

/////
//
//

test('{{sentenceCase name}} async test', async function (t) {
	const results = await somethingAsync();
});

test('{{sentenceCase name}} test', function (t) {

});
