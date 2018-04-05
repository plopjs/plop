import path from 'path';
import * as fspp from '../fs-promise-proxy';

const getFullData = (data, cfg) => Object.assign({}, cfg.data, data);
export const makeDestPath = (data, cfg, plop) =>
	path.resolve(
		plop.getDestBasePath(),
		plop.renderString(cfg.path || '', getFullData(data, cfg))
	);

export function* getTemplate(data, cfg, plop) {
	const makeTmplPath = p => path.resolve(plop.getPlopfilePath(), p);

	let { template } = cfg;

	if (cfg.templateFile) {
		const templateFile = plop.renderString(
			cfg.templateFile,
			getFullData(data, cfg)
		);
		template = yield fspp.readFile(makeTmplPath(templateFile));
	}
	if (template == null) {
		template = '';
	}

	return template;
}

export function* getRenderedTemplate(data, cfg, plop) {
	const template = yield getTemplate(data, cfg, plop);

	return plop.renderString(template, getFullData(data, cfg));
}

export const getRelativeToBasePath = (filePath, plop) =>
	filePath.replace(path.resolve(plop.getDestBasePath()), '');

export const throwStringifiedError = err => {
	if (typeof err === 'string') {
		throw err;
	} else {
		throw err.message || JSON.stringify(err);
	}
};
