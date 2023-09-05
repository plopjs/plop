#!/usr/bin/env node

import fs from "fs";
import * as path from "path";
import * as url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Keep backup of temporary README
fs.copyFileSync(
  path.join(__dirname, "../README.md"),
  path.join(__dirname, "./README.md"),
);

// Move main README
fs.copyFileSync(
  path.join(__dirname, "../../../README.md"),
  path.join(__dirname, "../README.md"),
);
