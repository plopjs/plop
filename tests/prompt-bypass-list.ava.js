import AvaTest from './_base-ava-test';
import promptBypass from '../lib/prompt-bypass';

const {test, nodePlop} = (new AvaTest(__filename));
const plop = nodePlop();

const prompts = [{
	type:'list',
	name:'list',
	message:'listMsg',
	choices: [
		'eh',
		{key: 'b', value:'bee'},
		{name: 'c', value: 'see'},
		{value: 'd'},
		{name: 'e'},
		{key: 'f', name: 'ff', value: { prop: 'value'}}
	]
}];

test('verify good bypass input', function (t) {
	// answer is string
	[
		{ bypassValue: 'eh', expectedAnswer: 'eh' }, // by value
		{ bypassValue: 'b', expectedAnswer: 'bee' }, // by key
		{ bypassValue: 'c', expectedAnswer: 'see' }, // by name
		{ bypassValue: 'd', expectedAnswer: 'd' }, // by value prop
		{ bypassValue: 'e', expectedAnswer: 'e' }, // by name, no value
		{ bypassValue: '0', expectedAnswer: 'eh' }, // by index - value
		{ bypassValue: '1', expectedAnswer: 'bee' }, // by index - key
		{ bypassValue: '2', expectedAnswer: 'see' }, // by index - name
		{ bypassValue: '3', expectedAnswer: 'd' }, // by index - value prop
		{ bypassValue: '4', expectedAnswer: 'e' }, // by index - name, no value
		{ bypassValue: 4, expectedAnswer: 'e' }, // by index number
	].forEach(testCase => {
		const [, value] = promptBypass(prompts, [testCase.bypassValue], plop);
		t.is(value.list, testCase.expectedAnswer);
	});

	// answer is object
	const objValue = { prop: 'value' };
	[
		{ bypassValue: 'f', expectedAnswer: objValue }, // by key
		{ bypassValue: 'ff', expectedAnswer: objValue }, // by name
		{ bypassValue: '5', expectedAnswer: objValue }, // by index
		{ bypassValue: 5, expectedAnswer: objValue }, // by index number
	].forEach(testCase => {
		const [, value] = promptBypass(prompts, [testCase.bypassValue], plop);
		t.deepEqual(value.list, testCase.expectedAnswer);
	});
});

test('verify bad bypass input', function (t) {
	[
		'asdf',
		'6',
		6,
	].forEach(bypassValue => {
		t.throws(() => promptBypass(prompts, [bypassValue], plop));
	});
});
