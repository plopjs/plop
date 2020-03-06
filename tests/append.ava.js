import fs from 'fs';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = new AvaTest(__filename);

const plop = nodePlop(`${mockPath}/plopfile.js`);
const makeList = plop.getGenerator('make-list');
const appendToList = plop.getGenerator('append-to-list');

test('Check if list has been created', async function (t) {
	await makeList.runActions({listName: 'test'});
	const filePath = path.resolve(testSrcPath, 'test.txt');
	t.true(fs.existsSync(filePath), filePath);
});

test('Check if entry will be appended', async function (t) {
	await makeList.runActions({listName: 'list1'});
	await appendToList.runActions({listName: 'list1', name: 'Marco', allowDuplicates: false});
	await appendToList.runActions({listName: 'list1', name: 'Polo', allowDuplicates: false});
	const filePath = path.resolve(testSrcPath, 'list1.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is((content.match(/Marco1/g) || []).length, 1);
	t.is((content.match(/Polo1/g) || []).length, 1);
	t.is((content.match(/Marco2/g) || []).length, 1);
	t.is((content.match(/Polo2/g) || []).length, 1);
});

test('Check if duplicates get filtered', async function (t) {
	await makeList.runActions({listName: 'list2'});

	await appendToList.runActions({listName: 'list2', name: 'Marco', allowDuplicates: false});
	await appendToList.runActions({listName: 'list2', name: 'Polo', allowDuplicates: false});
	await appendToList.runActions({listName: 'list2', name: 'Marco', allowDuplicates: false});
	const filePath = path.resolve(testSrcPath, 'list2.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is((content.match(/Marco1/g) || []).length, 1);
	t.is((content.match(/Polo1/g) || []).length, 1);
	t.is((content.match(/Marco2/g) || []).length, 1);
	t.is((content.match(/Polo2/g) || []).length, 1);
});

test('Check if duplicates are kept, if allowed', async function (t) {
	await makeList.runActions({listName: 'list3'});
	await appendToList.runActions({listName: 'list3', name: 'Marco', allowDuplicates: true});
	await appendToList.runActions({listName: 'list3', name: 'Polo', allowDuplicates: true});
	await appendToList.runActions({listName: 'list3', name: 'Marco', allowDuplicates: true});
	const filePath = path.resolve(testSrcPath, 'list3.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is((content.match(/Marco1/g) || []).length, 2);
	t.is((content.match(/Polo1/g) || []).length, 1);
	t.is((content.match(/Marco2/g) || []).length, 2);
	t.is((content.match(/Polo2/g) || []).length, 1);
});

test('Check if duplicates are only removed below the pattern', async function (t) {
	await makeList.runActions({listName: 'list4'});

	await appendToList.runActions({listName: 'list4', name: 'Plop', allowDuplicates: false});
	await appendToList.runActions({listName: 'list4', name: 'Polo', allowDuplicates: false});
	await appendToList.runActions({listName: 'list4', name: 'Plop', allowDuplicates: false});
	const filePath = path.resolve(testSrcPath, 'list4.txt');
	const content = fs.readFileSync(filePath).toString();

	t.is((content.match(/Plop1/g) || []).length, 1);
	t.is((content.match(/Polo1/g) || []).length, 1);
	t.is((content.match(/Plop2/g) || []).length, 1);
	t.is((content.match(/Polo2/g) || []).length, 1);

	// there's a plop at the top
	t.is((content.match(/Plop/g) || []).length, 3);
});
