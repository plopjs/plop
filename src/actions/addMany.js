import co from 'co';
import path from 'path';
import fs from 'fs';
import globby from 'globby';
import actionInterfaceTest from './_common-action-interface-check';
import addFile from './_common-action-add-file';

export default co.wrap(function* (data, cfg, plop) {
	const cfgWithCommonInterface = Object.assign({}, cfg, {
		path: cfg.destination
	});
	const interfaceTestResult = actionInterfaceTest(cfgWithCommonInterface);
	if (interfaceTestResult !== true) { throw interfaceTestResult; }

	if (cfg.base) {
		cfg.base = plop.renderString(cfg.base, data);
	}
	let templateFiles = [];
	if(typeof cfg.templateFiles === 'function'){
		templateFiles = cfg.templateFiles(
			// Only allow the sync function to be called
			(patterns,options)=> {				
				patterns = [].concat(patterns).map(file=> plop.renderString(file,data));				
				return globby.sync(patterns,Object.assign({},options,{cwd:plop.getPlopfilePath()}));
			},data,cfg,plop
		);
	}
	else{
		cfg.templateFiles = []
			// Ensure `cfg.templateFiles` is an array, even if a string is passed.
			.concat(cfg.templateFiles)
			.map((file) => plop.renderString(file, data));
		templateFiles = resolveTemplateFiles(cfg.templateFiles, plop);
	}
	templateFiles = filterTemplateFiles(templateFiles, cfg.base, plop.getPlopfilePath());
    
	const filesAdded = [];
	for (let templateFile of templateFiles) {
		const fileCfg = Object.assign({}, cfg, {
			path: resolvePath(cfg.destination, templateFile, cfg.base),
			templateFile: templateFile
		});
		const addedPath = yield addFile(data, fileCfg, plop);
		filesAdded.push(addedPath);
	}

	return `${filesAdded.length} files added\n -> ${filesAdded.join('\n -> ')}`;
});

function resolveTemplateFiles(templateFilesGlob, plop) {
	return globby.sync(templateFilesGlob, { cwd: plop.getPlopfilePath() });
}
function filterTemplateFiles(templateFiles,basePath, plopWorkingDir) {
	return templateFiles
		.filter(isUnder(basePath))
		.filter(isAbsoluteOrRelativeFileTo(plopWorkingDir));
}
function isAbsoluteOrRelativeFileTo(relativePath) {
	const isFile = file => fs.existsSync(file) && fs.lstatSync(file).isFile();
	return file => isFile(file) || isFile(path.join(relativePath,file));
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
