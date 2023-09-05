import fs from "fs";
import { mkdirp } from "mkdirp";

export const makeDir = mkdirp;
export const readdir = fs.promises.readdir;
export const stat = fs.promises.stat;
export const chmod = fs.promises.chmod;
export const readFile = (path) => fs.promises.readFile(path, "utf8");
export const writeFile = (path, data) =>
  fs.promises.writeFile(path, data, "utf8");
export const readFileRaw = (path) => fs.promises.readFile(path, null);
export const writeFileRaw = (path, data) =>
  fs.promises.writeFile(path, data, null);
export const fileExists = (path) =>
  fs.promises.access(path).then(
    () => true,
    () => false,
  );

export const constants = fs.constants;
