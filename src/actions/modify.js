import co from 'co';
import path from 'path';
import * as fspp from '../fs-promise-proxy';
import actionInterfaceTest from './_common-action-interface-check';

export default co.wrap(function* (data, cfg, plop) {
	const interfaceTestResult = actionInterfaceTest(cfg);
	if (interfaceTestResult !== true) { throw interfaceTestResult; }

	// if not already an absolute path, make an absolute path from the basePath (plopfile location)
	const makeTmplPath = p => path.resolve(plop.getPlopfilePath(), p);
	const makeDestPath = p => path.resolve(plop.getDestBasePath(), p);

	var {template} = cfg;
	const fileDestPath = makeDestPath(plop.renderString(cfg.path || '', data));

	try {
		if (cfg.templateFile) {
			template = yield fspp.readFile(makeTmplPath(cfg.templateFile));
		}
		if (template == null) { template = ''; }

		// check path
		const pathExists = yield fspp.fileExists(fileDestPath);

		if (!pathExists) {
			throw 'File does not exists';
		} else {
			var fileData = yield fspp.readFile(fileDestPath);
			fileData = fileData.replace(cfg.pattern, plop.renderString(template, data));
			yield fspp.writeFile(fileDestPath, fileData);
		}

		// return the modified file path (relative to the destination path)
		return fileDestPath.replace(path.resolve(plop.getDestBasePath()), '');
	} catch(err) {
		if (typeof err === 'string') {
			throw err;
		} else {
			throw err.message || JSON.stringify(err);
		}
	}
});
