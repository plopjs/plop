import path from 'path';
import {
	getRenderedTemplate,
	makeDestPath,
	throwStringifiedError,
	getRelativeToBasePath
} from './_common-action-utils';
import * as fspp from '../fs-promise-proxy';

export default function* addFile(data, cfg, plop) {
	const fileDestPath = makeDestPath(data, cfg, plop);
	try {
		// check path
		const pathExists = yield fspp.fileExists(fileDestPath);

		if (pathExists) {
			throw `File already exists\n -> ${fileDestPath}`;
		} else {
			yield fspp.makeDir(path.dirname(fileDestPath));
			const renderedTemplate = yield getRenderedTemplate(data, cfg, plop);
			yield fspp.writeFile(fileDestPath, renderedTemplate);
		}

		// return the added file path (relative to the destination path)
		return getRelativeToBasePath(fileDestPath, plop);
	} catch (err) {
		throwStringifiedError(err);
	}
}
