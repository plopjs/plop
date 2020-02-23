const del = require('del');
const fspp = require('../../src/fs-promise-proxy');
import { normalizePath } from '../../src/actions/_common-action-utils';

module.exports = async function (data, cfg /*, plop*/) {
	const removeFilePath = cfg.path;
	if (await fspp.fileExists(removeFilePath)) {
		return await del([normalizePath(removeFilePath)]);
	} else {
		throw `Path does not exist ${removeFilePath}`;
	}
};
