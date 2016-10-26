const test = require('ava').test;
const path = require('path');
const del = require('del');

// clean out the /src dir when done
test.after(() => del.sync(path.resolve(__dirname, 'tests/mock/src')));
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
const noPlopfile = require('./tests/no-plopfile');
test('basic add action (no plopfile)', noPlopfile.basic);
