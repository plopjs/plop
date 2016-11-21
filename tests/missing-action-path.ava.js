import co from 'co';
import AvaTest from './_base-ava-test';
const {test, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

test.beforeEach(() => {
	plop.setGenerator('no-path', {
		actions: [
			{ type: 'add', template: '{{name}}', abortOnFail: false },
			{ type: 'add', path: '', template: '{{name}}' }
		]
	});
});

test('Check that the file has been created', co.wrap(function* (t) {
	const name = 'no path';
	const results = yield plop.getGenerator('no-path').runActions({name});
	const {changes, failures} = results;

	t.is(changes.length, 0);
	t.is(failures.length, 2);
	t.is(failures[0].error, 'Invalid path "undefined"');
	t.is(failures[1].error, 'Invalid path ""');
}));
