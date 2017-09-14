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

	const templateFiles = resolveTemplateFiles(cfg.templateFiles, cfg.base, plop);
	const filesAdded = [];
	for (let templateFile of templateFiles) {
		const fileCfg = Object.assign({}, cfg, {
			path: toUnix(resolvePath(cfg.destination, templateFile, cfg.base)),
			templateFile: templateFile
		});

		const addedPath = yield addFile(data, fileCfg, plop);
		filesAdded.push(addedPath);
	}

	return `${filesAdded.length} files added\n -> ${filesAdded.join('\n -> ')}`;
});

/**
 * This function converts a non POSIX/UNIX path to it
 * @param {string} path The path to convert to POSIX/UNIX format 
 */
function toUnix(path) {
	return !path.sep || path.sep === '\\'  ? path.replace(/\\/g, '/') : path;
}

function resolveTemplateFiles(templateFilesGlob, basePath, plop) {
	return globby.sync(templateFilesGlob, { cwd: plop.getPlopfilePath() })
		.filter(isUnder(basePath))
		.filter(isFile);
}

function isFile(file) {
	const fileParts = file.split(path.sep);
	const lastFilePart = fileParts[fileParts.length - 1];
	const hasExtension = !!(lastFilePart.split('.')[1]);

	return hasExtension;
}

function isUnder(basePath = '') {
	return (path) => path.startsWith(basePath);
}

function resolvePath(destination, file, rootPath) {
	return path.join(destination, dropFileRootPath(file, rootPath));
}

function dropFileRootPath(file, rootPath) {
	return (rootPath) ? file.replace(rootPath, '') : dropFileRootFolder(file);
}

function dropFileRootFolder(file) {
	const fileParts = path.normalize(file).split(path.sep);
	fileParts.shift();

	return fileParts.join(path.sep);
}
