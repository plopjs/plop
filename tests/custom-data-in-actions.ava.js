// import fs from 'fs';
import * as fspp from '../src/fs-promise-proxy';
import co from 'co';
import path from 'path';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop(`${mockPath}/plopfile.js`);
const customData = plop.getGenerator('custom-data-in-actions');

test('Check that custom data is in template', co.wrap(function*(t){
	yield customData.runActions({});
	const file = path.resolve(testSrcPath, 'Frodo-loves-who.txt');
	const content = yield fspp.readFile(file);
	t.is(content, 'Frodo loves Gandalf');
}));

test('Check that data is overridden', co.wrap(function*(t) {
	yield customData.runActions({name: 'Sauron'});
	const filePath = path.resolve(testSrcPath, 'Sauron-loves-who.txt');
	const greetSubjectPath = path.resolve(testSrcPath, 'hola-world.txt');

	t.is(yield fspp.readFile(filePath), 'Sauron loves Gandalf');
	t.true(yield fspp.fileExists(greetSubjectPath));
}));
