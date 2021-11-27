import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, mockPath, testSrcPath, nodePlop} = new AvaTest(__filename);


var plop;
var makeList;
var appendToList;
test.before(async () => {
	plop = await nodePlop(`${mockPath}/plopfile.js`);
	makeList = plop.getGenerator('make-list');
	appendToList = plop.getGenerator('append-to-list');
});

test('Check if entry will be appended', async function (t) {
	await makeList.runActions({listName: 'test'});
	await appendToList.runActions({listName: 'test', name: 'Marco'});
	await appendToList.runActions({listName: 'test', name: 'Polo'});
	const filePath = path.resolve(testSrcPath, 'test.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is(content, 'Marco\nPolo');
});
