import co from 'co';
import * as fspp from '../fs-promise-proxy';

import {
	getRenderedTemplate,
	makeDestPath,
	throwStringifiedError,
	getRelativeToBasePath
} from './_common-action-utils';

import actionInterfaceTest from './_common-action-interface-check';

const doAppend = function*(data, cfg, plop, fileData) {
	const stringToAppend = yield getRenderedTemplate(data, cfg, plop);
	// if the appended string should be unique (default),
	// remove any occurence of it (but only if pattern would match)

	const { separator = '\n' } = cfg;
	if (cfg.unique !== false) {
		// only remove after "pattern", so that we remove not too much accidentally
		const parts = fileData.split(cfg.pattern);
		const lastPart = parts[parts.length - 1];
		const lastPartWithoutDuplicates = lastPart.replace(
			new RegExp(separator + stringToAppend, 'g'),
			''
		);
		fileData = fileData.replace(lastPart, lastPartWithoutDuplicates);
	}

	// add the appended string to the end of the "fileData" if "pattern"
	// was not provided, i.e. null or false
	if (!cfg.pattern) {
		// make sure to add a "separator" if "fileData" is not empty
		if (fileData.length > 0) {
			fileData += separator;
		}
		return fileData + stringToAppend;
	}

	return fileData.replace(cfg.pattern, '$&' + separator + stringToAppend);
};

export default co.wrap(function*(data, cfg, plop) {
	const interfaceTestResult = actionInterfaceTest(cfg);
	if (interfaceTestResult !== true) {
		throw interfaceTestResult;
	}
	const fileDestPath = makeDestPath(data, cfg, plop);
	try {
		// check path
		const pathExists = yield fspp.fileExists(fileDestPath);
		if (!pathExists) {
			throw 'File does not exist';
		} else {
			let fileData = yield fspp.readFile(fileDestPath);
			fileData = yield doAppend(data, cfg, plop, fileData);
			yield fspp.writeFile(fileDestPath, fileData);
		}
		return getRelativeToBasePath(fileDestPath, plop);
	} catch (err) {
		throwStringifiedError(err);
	}
});
