---
"plop": patch
---

Replace minimist with native Node.js util.parseArgs

This removes the minimist dependency in favor of the built-in util.parseArgs API available in Node.js 18.3+. Since plop already requires Node >=18, this is a safe change that reduces the dependency footprint.

The new args.js module provides a minimist-compatible interface, including handling of positional arguments after `--` for generator bypass data.
