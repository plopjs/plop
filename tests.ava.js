const test = require('ava').test;
const path = require('path');
const del = require('del');
const srcPath = path.resolve(__dirname, 'tests/mock/src');
const clear = () => require('del').sync(srcPath);

// clean out the /src dir when done
test.before(clear);
test.after(clear);
// clear screen before each run
test.before(() => process.stdout.write('\u001B[2J\u001B[0;0f'));

/////
// plop specs
//

// basic action test with plopfile
test('basic add action', require('./tests/basic-plopfile'));

// dynamic actions (the potato tests)
const dynActions = require('./tests/dynamic-actions');
test('dynamic actions (yes potato)', dynActions.yesPotatoes);
test('dynamic actions (no potato)', dynActions.noPotatoes);

// tests for using plop with no plopfile
test('basic add action (no plopfile)', require('./tests/basic-no-plopfile'));

// action object interface tests
test('add action failure (file already exists)', require('./tests/add-action-failure'));
test('add action with no template', require('./tests/add-action-no-template'));
test('missing action path', require('./tests/missing-action-path'));
test('abort on fail', require('./tests/abort-on-fail'));
