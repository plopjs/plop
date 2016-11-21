import fs from 'fs';
import co from 'co';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

/////
// 
//

test('{{sentenceCase name}} async test', co.wrap(function* (t) {
	const results = yield somethingAsync();
}));

test('{{sentenceCase name}} test', function (t) {

});
