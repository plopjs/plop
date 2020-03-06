import fs from 'fs';
import AvaTest from './_base-ava-test';
const {test, mockPath, testSrcPath, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop(`${mockPath}/sub/plopfile.js`);

test('Force del outside cwd test', async function (t) {
	process.chdir(`${mockPath}/sub`);
	fs.mkdirSync(testSrcPath);
	fs.writeFileSync(testSrcPath + '/test.txt', 'init content');
	const testGen = plop.getGenerator('test');
	const {changes} = await testGen.runActions();
	const content = fs.readFileSync(testSrcPath + '/test.txt', 'utf8');
	t.is(changes.length, 1);
	t.is(content, 'test content');
});
