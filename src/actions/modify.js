import * as fspp from '../fs-promise-proxy';
import {
	getRenderedTemplate,
	makeDestPath,
	throwStringifiedError,
	getRelativeToBasePath,
	getRenderedTemplatePath
} from './_common-action-utils';

import actionInterfaceTest from './_common-action-interface-check';

export default async function (data, cfg, plop) {
	const interfaceTestResult = actionInterfaceTest(cfg);
	if (interfaceTestResult !== true) {
		throw interfaceTestResult;
	}
	const fileDestPath = makeDestPath(data, cfg, plop);
	try {
		// check path
		const pathExists = await fspp.fileExists(fileDestPath);

		if (!pathExists) {
			throw 'File does not exist';
		} else {
			let fileData = await fspp.readFile(fileDestPath);
			cfg.templateFile = getRenderedTemplatePath(data, cfg, plop);
			const replacement = await getRenderedTemplate(data, cfg, plop);
			fileData = fileData.replace(cfg.pattern, replacement);
			await fspp.writeFile(fileDestPath, fileData);
		}
		return getRelativeToBasePath(fileDestPath, plop);
	} catch (err) {
		throwStringifiedError(err);
	}
}
