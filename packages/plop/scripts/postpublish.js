#!/usr/bin/env node

import fs from "fs";
import * as path from "path";
import * as url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const exists = fs.existsSync("./README.md");

if (exists) {
  // Restore version of README previously there.
  fs.copyFileSync(
    path.join(__dirname, "./README.md"),
    path.join(__dirname, "../README.md"),
  );

  fs.unlinkSync(path.join(__dirname, "./README.md"));
}
