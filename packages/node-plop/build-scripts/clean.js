import { rmSync } from "node:fs";

rmSync("./lib", { recursive: true, force: true });
