// Dependencies
import test from 'ava';
import path from 'path';
import del from 'del';
// Spec files
import basicPlopFile from './tests/basic-plopfile';
import dynamicActions from './tests/dynamic-actions';
import basicNoPlopfile from './tests/basic-no-plopfile';
import addActionFailure from './tests/add-action-failure';
import addActionNoTemplate from './tests/add-action-no-template';
import missingActionPath from './tests/missing-action-path';
import abortOnFail from './tests/abort-on-fail';
import generatorNameAndPrompts from './tests/generator-name-and-prompts';

const clear = () => {
	const srcPath = path.resolve(__dirname, 'tests/mock/src');
	del.sync(srcPath);
};

// clean out the /src dir when done
test.before(clear);
test.after(clear);
// clear screen before each run
test.before(() => process.stdout.write('\u001B[2J\u001B[0;0f'));

/////
// plop specs
//

// basic action test with plopfile
test('basic add action', basicPlopFile);

// dynamic actions (the potato tests)
test('dynamic actions (yes potato)', dynamicActions.yesPotatoes);
test('dynamic actions (no potato)', dynamicActions.noPotatoes);

// tests for using plop with no plopfile
test('basic add action (no plopfile)', basicNoPlopfile);

// action object interface tests
test('add action failure (file already exists)', addActionFailure);
test('add action with no template', addActionNoTemplate);
test('missing action path', missingActionPath);
test('abort on fail', abortOnFail);
test('generator name and prompts', generatorNameAndPrompts);
