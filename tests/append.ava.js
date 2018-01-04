import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = new AvaTest(__filename);

const plop = nodePlop(`${mockPath}/plopfile.js`);
const makeList = plop.getGenerator('make-list');
const appendToList = plop.getGenerator('append-to-list');

test('Check if list has been created', async (t) => {
	await makeList.runActions({listName: 'test'});
	const filePath = path.resolve(testSrcPath, 'test.txt');
	t.true(fs.existsSync(filePath), filePath);
});

test('Check if entry will be appended', async (t) => {
	await makeList.runActions({listName: 'list1'});
	await appendToList.runActions({listName: 'list1', name: 'Marco', allowDuplicates: false});
	await appendToList.runActions({listName: 'list1', name: 'Polo', allowDuplicates: false});
	const filePath = path.resolve(testSrcPath, 'list1.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is((content.match(/Marco/g) || []).length, 1);
	t.is((content.match(/Polo/g) || []).length, 1);
});

test('Check if duplicates get filtered', async (t) => {
	await makeList.runActions({listName: 'list2'});

	await appendToList.runActions({listName: 'list2', name: 'Marco', allowDuplicates: false});
	await appendToList.runActions({listName: 'list2', name: 'Polo', allowDuplicates: false});
	await appendToList.runActions({listName: 'list2', name: 'Marco', allowDuplicates: false});
	const filePath = path.resolve(testSrcPath, 'list2.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is((content.match(/Marco/g) || []).length, 1);
	t.is((content.match(/Polo/g) || []).length, 1);
});

test('Check if duplicates are kept, if allowed', async (t) => {
	await makeList.runActions({listName: 'list3'});
	await appendToList.runActions({listName: 'list3', name: 'Marco', allowDuplicates: true});
	await appendToList.runActions({listName: 'list3', name: 'Polo', allowDuplicates: true});
	await appendToList.runActions({listName: 'list3', name: 'Marco', allowDuplicates: true});
	const filePath = path.resolve(testSrcPath, 'list3.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is((content.match(/Marco/g) || []).length, 2);
	t.is((content.match(/Polo/g) || []).length, 1);
});
