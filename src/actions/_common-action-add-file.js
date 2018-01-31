import path from 'path';
import del from 'del';
import * as fspp from '../fs-promise-proxy';

export default function* addFile(data, cfg, plop) {
	// if not already an absolute path, make an absolute path from the basePath (plopfile location)
	const makeTmplPath = p => path.resolve(plop.getPlopfilePath(), p);
	const makeDestPath = p => path.resolve(plop.getDestBasePath(), p);

	let {template} = cfg;
	const {force, templateFile} = cfg;
	const fileDestPath = makeDestPath(plop.renderString(cfg.path || '', data));

	try {
		if (templateFile) {
			template = yield fspp.readFile(makeTmplPath(templateFile));
		}
		if (template == null) { template = ''; }

		// check path
		let pathExists = yield fspp.fileExists(fileDestPath);

		// if we are forcing and the file already exists, delete the file
		if (force === true && pathExists) {
			yield del([fileDestPath]);
			pathExists = false;
		}

		// we can't create files where one already exists
		if (pathExists) {
			throw `File already exists\n -> ${fileDestPath}`;
		} else {
			yield fspp.makeDir(path.dirname(fileDestPath));
			yield fspp.writeFile(fileDestPath, plop.renderString(template, data));
		}

		// return the added file path (relative to the destination path)
		return fileDestPath.replace(path.resolve(plop.getDestBasePath()), '');

	} catch(err) {
		if (typeof err === 'string') {
			throw err;
		} else {
			throw err.message || JSON.stringify(err);
		}
	}
}
