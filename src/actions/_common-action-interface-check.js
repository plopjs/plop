export default function(action, {checkPath=true, checkAbortOnFail=true} = {}) {

	// it's not even an object, you fail!
	if (typeof action !== 'object') {
		return `Invalid action object: ${JSON.stringify(action)}`;
	}

	const {path, abortOnFail} = action;

	if (checkPath && (typeof path !== 'string' || path.length === 0)) {
		return `Invalid path "${path}"`;
	}

	// abortOnFail is optional, but if it's provided it needs to be a Boolean
	if (checkAbortOnFail && abortOnFail !== undefined && typeof abortOnFail !== 'boolean') {
		return `Invalid value for abortOnFail (${abortOnFail} is not a Boolean)`;
	}

	if ('transform' in action && typeof action.transform !== 'function') {
		return `Invalid value for transform (${action.transform} is not a function)`;
	}

	return true;
}
