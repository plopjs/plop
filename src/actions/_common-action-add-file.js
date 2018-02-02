import path from 'path';
import del from 'del';
import {
	getRenderedTemplate,
	makeDestPath,
	throwStringifiedError,
	getRelativeToBasePath
} from './_common-action-utils';
import * as fspp from '../fs-promise-proxy';

export default function* addFile(data, cfg, plop) {
	const fileDestPath = makeDestPath(data, cfg, plop);
	const { force, skipIfExists = false } = cfg;
	try {
		// check path
		let pathExists = yield fspp.fileExists(fileDestPath);

		// if we are forcing and the file already exists, delete the file
		if (force === true && pathExists) {
			yield del([fileDestPath]);
			pathExists = false;
		}

		// we can't create files where one already exists
		if (pathExists) {
			if (skipIfExists) { return `[SKIPPED] ${fileDestPath} (exists)`; }
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
