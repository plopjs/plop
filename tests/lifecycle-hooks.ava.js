import AvaTest from './_base-ava-test';
const {test, nodePlop} = (new AvaTest(__filename));

const errAction = () => {throw Error('');};

// onSuccess and onFailure Lifecycle hooks
test('Lifecycle hooks test (onSuccess, onFailure)', async function (t) {
	const plop = nodePlop();
	const onSuccess = () => onSuccess.called++; onSuccess.called = 0;
	const onFailure = () => onFailure.called++; onFailure.called = 0;

	await plop
		.setGenerator('', {actions: [() => 'yes', errAction]})
		.runActions({}, {onSuccess, onFailure});

	t.is(onSuccess.called, 1);
	t.is(onFailure.called, 1);
});

test('Lifecycle hooks negative scenario test (onSuccess)', async function (t) {
	const plop = nodePlop();
	const onSuccess = () => onSuccess.called++; onSuccess.called = 0;
	const onFailure = () => onFailure.called++; onFailure.called = 0;

	await plop
		.setGenerator('', {actions: [errAction, errAction]})
		.runActions({}, {onSuccess, onFailure});

	t.is(onSuccess.called, 0);
	t.is(onFailure.called, 2);
});

test('Lifecycle hooks negative scenario test (onFailure)', async function (t) {
	const plop = nodePlop();
	const onSuccess = () => onSuccess.called++; onSuccess.called = 0;
	const onFailure = () => onFailure.called++; onFailure.called = 0;

	await plop
		.setGenerator('', {actions: [() => 'yes', () => 'yes']})
		.runActions({}, {onSuccess, onFailure});

	t.is(onSuccess.called, 2);
	t.is(onFailure.called, 0);
});

test('Lifecycle hook test (onComment)', async function (t) {
	const plop = nodePlop();
	const onSuccess = () => onSuccess.called++; onSuccess.called = 0;
	const onFailure = () => onFailure.called++; onFailure.called = 0;
	const onComment = () => onComment.called++; onComment.called = 0;

	await plop
		.setGenerator('', {actions: ['yes', () => 'yes', errAction, 'yes']})
		.runActions({}, {onSuccess, onFailure, onComment});

	t.is(onSuccess.called, 1);
	t.is(onFailure.called, 1);
	t.is(onComment.called, 1);
});
