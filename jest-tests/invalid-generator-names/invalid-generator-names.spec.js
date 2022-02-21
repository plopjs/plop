import nodePlop from '../../src/index.js';
import {setupMockPath} from "../helpers/path.js";
const {clean} = setupMockPath(import.meta.url);

afterEach(clean);

var plop;
beforeEach(async () => {
	plop = await nodePlop();
});

test('Invalid generator names test', function () {
	plop.setGenerator('test');
	expect(() => plop.getGenerator('error')).toThrowError({instanceOf: Error, message: 'Generator "error" does not exist.'});
});
