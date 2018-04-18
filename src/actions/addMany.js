import co from 'co';
import path from 'path';
import fs from 'fs';
import globby from 'globby';
import isBinary from 'isbinaryfile';
import {readFile} from '../fs-promise-proxy';
import actionInterfaceTest from './_common-action-interface-check';
import addFile from './_common-action-add-file';

export default co.wrap(function* (data, cfg, plop) {
	// check the common action interface attributes. skip path check because it's NA
	const interfaceTestResult = actionInterfaceTest(cfg, {checkPath: false});
	if (interfaceTestResult !== true) { throw interfaceTestResult; }
	// check that destination (instead of path) is a string value
	const dest = cfg.destination;
	if (typeof dest !== 'string' || dest.length === 0) { throw `Invalid destination "${dest}"`; }

	if (cfg.base) {
		cfg.base = plop.renderString(cfg.base, data);
	}

	if (typeof cfg.templateFiles === 'function'){
		cfg.templateFiles = cfg.templateFiles();
	}

	cfg.templateFiles = []
		.concat(cfg.templateFiles) // Ensure `cfg.templateFiles` is an array, even if a string is passed.
		.map((file) => plop.renderString(file, data)); // render the paths as hbs templates

	const templateFiles = resolveTemplateFiles(cfg.templateFiles, cfg.base, cfg.globOptions, plop);

	const filesAdded = [];
	for (let templateFile of templateFiles) {
		const absTemplatePath = path.resolve(plop.getPlopfilePath(), templateFile);
		const fileCfg = Object.assign({}, cfg, {
			path: resolvePath(cfg.destination, templateFile, cfg.base)
		});
		Object.assign(fileCfg, (
			isBinary.sync(absTemplatePath)
				? { templateFile: absTemplatePath }
				: { template: yield readFile(absTemplatePath) }
		));
		const addedPath = yield addFile(data, fileCfg, plop);
		filesAdded.push(addedPath);
	}

	return `${filesAdded.length} files added\n -> ${filesAdded.join('\n -> ')}`;
});

function resolveTemplateFiles(templateFilesGlob, basePath, globOptions, plop) {
	globOptions = Object.assign({ cwd: plop.getPlopfilePath() }, globOptions);
	return globby.sync(templateFilesGlob, Object.assign({nobrace: true}, globOptions))
		.filter(isUnder(basePath))
		.filter(isAbsoluteOrRelativeFileTo(plop.getPlopfilePath()));
}
function isAbsoluteOrRelativeFileTo(relativePath) {
	const isFile = file => fs.existsSync(file) && fs.lstatSync(file).isFile();
	return file => isFile(file) || isFile(path.join(relativePath, file));
}

function isUnder(basePath = '') {
	return (path) => path.startsWith(basePath);
}

function resolvePath(destination, file, rootPath) {
	return toUnix(path.join(destination, dropFileRootPath(file, rootPath)));
}

function toUnix(path) {
	return !path.sep || path.sep === '\\'  ? path.replace(/\\/g, '/') : path;
}

function dropFileRootPath(file, rootPath) {
	return (rootPath) ? file.replace(rootPath, '') : dropFileRootFolder(file);
}

function dropFileRootFolder(file) {
	const fileParts = path.normalize(file).split(path.sep);
	fileParts.shift();

	return fileParts.join(path.sep);
}
