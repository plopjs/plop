import AvaTest from './_base-ava-test.js';
const {test, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

test('Invalid generator names test', function (t) {
	plop.setGenerator('test');
	const error = t.throws(() => plop.getGenerator('error'), {instanceOf: Error});
	t.is(error.message, 'Generator "error" does not exist.');
});
