import AvaTest from './_base-ava-test';
const {test, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

/////
// if an action has no path, the action should fail
//

test('Check that abortOnFail:true prevents future actions', async function (t) {
	plop.setGenerator('abort-on-fail-true', {
		actions: [{abortOnFail: true}, {}]
	});

	const results = await plop.getGenerator('abort-on-fail-true').runActions({});
	const {changes, failures} = results;

	t.is(changes.length, 0);
	t.is(failures.length, 2);
	t.is(failures[0].error, 'Invalid action (#1)');
	t.is(failures[1].error, 'Aborted due to previous action failure');
});

test('Check that abortOnFail:false does not prevent future actions', async function (t) {
	plop.setGenerator('abort-on-fail-false', {
		actions: [{abortOnFail: false}, {}]
	});

	const results = await plop.getGenerator('abort-on-fail-false').runActions({});
	const {changes, failures} = results;

	t.is(changes.length, 0);
	t.is(failures.length, 2);
	t.not(failures[1].error, 'Aborted due to previous action failure');
});
