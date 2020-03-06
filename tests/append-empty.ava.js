import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = new AvaTest(__filename);

const plop = nodePlop(`${mockPath}/plopfile.js`);
const makeList = plop.getGenerator('make-list');
const appendToList = plop.getGenerator('append-to-list');

test('Check if entry will be appended', async function (t) {
	await makeList.runActions({listName: 'test'});
	await appendToList.runActions({listName: 'test', name: 'Marco'});
	await appendToList.runActions({listName: 'test', name: 'Polo'});
	const filePath = path.resolve(testSrcPath, 'test.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is(content, 'Marco\nPolo');
});
