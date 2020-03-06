import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
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
