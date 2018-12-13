import co from 'co';
import AvaTest from './_base-ava-test';
const {test, nodePlop} = (new AvaTest(__filename));

const plop = nodePlop();

// onSuccess and onFailure Lifecycle hooks
test('Lifecycle hooks test (onSuccess, onFailure)', co.wrap(function* (t) {
	const onSuccess = () => onSuccess.called++;
	onSuccess.called = 0;
	const onFailure = () => onFailure.called++;
	onFailure.called = 0;

	yield plop
		.setGenerator('onSuccess', {actions: [() => 'success', () => {}]})
		.runActions({}, {onSuccess, onFailure});

	t.is(onSuccess.called, 1);
	t.is(onFailure.called, 1);
}));

test('Lifecycle hooks negative scenario test (onSuccess)', co.wrap(function* (t) {
	const onSuccess = () => onSuccess.called++;
	onSuccess.called = 0;
	const onFailure = () => onFailure.called++;
	onFailure.called = 0;

	yield plop
		.setGenerator('onSuccess', {actions: [() => {}, () => {}]})
		.runActions({}, {onSuccess, onFailure});

	t.is(onSuccess.called, 0);
	t.is(onFailure.called, 2);
}));

test('Lifecycle hooks negative scenario test (onFailure)', co.wrap(function* (t) {
	const onSuccess = () => onSuccess.called++;
	onSuccess.called = 0;
	const onFailure = () => onFailure.called++;
	onFailure.called = 0;

	yield plop
		.setGenerator('onSuccess', {actions: [() => 'yes', () => 'yes']})
		.runActions({}, {onSuccess, onFailure});

	t.is(onSuccess.called, 2);
	t.is(onFailure.called, 0);
}));
