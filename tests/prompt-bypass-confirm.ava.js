import AvaTest from './_base-ava-test';
import promptBypass from '../lib/prompt-bypass';

const {test, nodePlop} = (new AvaTest(__filename));
const plop = nodePlop();

const prompts = [
	{ type:'confirm', name:'confirm1', message:'confirmMsg1' },
	{ type:'confirm', name:'confirm2', message:'confirmMsg2' },
	{ type:'confirm', name:'confirm3', message:'confirmMsg3' },
	{ type:'confirm', name:'confirm4', message:'confirmMsg4' }
];

test('verify good bypass input', function (t) {
	const [, isTrue] = promptBypass(prompts, ['y','true','yes','t'], plop);
	t.true(isTrue.confirm1);
	t.true(isTrue.confirm2);
	t.true(isTrue.confirm3);
	t.true(isTrue.confirm4);

	const [, isTrueCap] = promptBypass(prompts, ['Y','True','YES','T'], plop);
	t.true(isTrueCap.confirm1);
	t.true(isTrueCap.confirm2);
	t.true(isTrueCap.confirm3);
	t.true(isTrueCap.confirm4);

	const [, notTrue] = promptBypass(prompts, ['n','false','no','n'], plop);
	t.false(notTrue.confirm1);
	t.false(notTrue.confirm2);
	t.false(notTrue.confirm3);
	t.false(notTrue.confirm4);

	const [, notTrueCap] = promptBypass(prompts, ['N','False','NO','N'], plop);
	t.false(notTrueCap.confirm1);
	t.false(notTrueCap.confirm2);
	t.false(notTrueCap.confirm3);
	t.false(notTrueCap.confirm4);
});

test('verify bad bypass input', function (t) {
	t.throws(() => promptBypass([prompts[0]], ['asdf'], plop));
	t.throws(() => promptBypass([prompts[0]], ['1'], plop));
	t.throws(() => promptBypass([prompts[0]], ['0'], plop));
	t.throws(() => promptBypass([prompts[0]], ['no way'], plop));
	t.throws(() => promptBypass([prompts[0]], ['NOOOOOO'], plop));
});
