import AvaTest from './_base-ava-test.js';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const {test, nodePlop} = (new AvaTest(__filename));

var plop;
test.before(async () => {
	plop = await nodePlop();
});

test('Invalid generator names test', function (t) {
	plop.setGenerator('test');
	const error = t.throws(() => plop.getGenerator('error'), {instanceOf: Error});
	t.is(error.message, 'Generator "error" does not exist.');
});
