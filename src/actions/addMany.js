import co from 'co';
import path from 'path';
import globby from 'globby';
import actionInterfaceTest from './_common-action-interface-check';
import addFile from './_common-action-add-file';

export default co.wrap(function* (data, cfg, plop) {
	const cfgWithCommonInterface = Object.assign({}, cfg, {
		path: cfg.destination
	});
	const interfaceTestResult = actionInterfaceTest(cfgWithCommonInterface);
	if (interfaceTestResult !== true) { throw interfaceTestResult; }

	for(let templateFile of resolveTemplateFiles(cfg.templateFiles, plop)) {
		const fileCfg = Object.assign({}, cfg, {
			path: resolvePath(cfg.destination, templateFile, cfg.base),
			templateFile: templateFile
		});

		yield addFile(data, fileCfg, plop);
	}
});

function resolveTemplateFiles(templateFilesGlob, plop) {
	return globby.sync([templateFilesGlob], {cwd: plop.getPlopfilePath()});
}

function resolvePath(destination, file, rootPath) {
	return path.join(destination, dropFileRootPath(file, rootPath)) ;
}

function dropFileRootPath(file, rootPath) {
	return (rootPath) ? file.replace(rootPath, '') : dropFileRootFolder(file);
}

function dropFileRootFolder(file) {
	const fileParts = file.split(path.sep);
	fileParts.shift();

	return fileParts.join(path.sep);
}
