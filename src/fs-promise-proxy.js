import pify from 'pify';
import fs from 'fs';
import mkdirp from 'mkdirp';

const _readFile = pify(fs.readFile);
const _writeFile = pify(fs.writeFile);
const _access = pify(fs.access);

export const makeDir = pify(mkdirp);
export const readdir = pify(fs.readdir);
export const readFile = path => _readFile(path, 'utf8');
export const writeFile = (path, data) => _writeFile(path, data, 'utf8');
export const readFileRaw = path => _readFile(path, null);
export const writeFileRaw = (path, data) => _writeFile(path, data, null);
export const fileExists = path => _access(path).then(() => true, () => false);
