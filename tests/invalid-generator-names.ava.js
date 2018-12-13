import AvaTest from './_base-ava-test';
const {test, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

test('Invalid generator names test', function (t) {
	plop.setGenerator('test');
	const error = t.throws(() => plop.getGenerator('error'), Error);
	t.is(error.message, 'Generator "error" does not exist.');
});
