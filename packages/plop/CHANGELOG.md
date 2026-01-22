# plop

## 4.0.5

### Patch Changes

- [#487](https://github.com/plopjs/plop/pull/487) [`25e7e17`](https://github.com/plopjs/plop/commit/25e7e1704728f632ac25ccdfacdd22f637fa1243) Thanks [@bjnewman](https://github.com/bjnewman)! - Replace minimist with native Node.js util.parseArgs

  This removes the minimist dependency in favor of the built-in util.parseArgs API available in Node.js 18.3+. Since plop already requires Node >=18, this is a safe change that reduces the dependency footprint.

  The new args.js module provides a minimist-compatible interface, including handling of positional arguments after `--` for generator bypass data.

## 4.0.4

### Patch Changes

- Fix uppercase and lowercase helpers

- Replace globby with tinyglobby

- Updated dependencies []:
  - node-plop@0.32.3

## 4.0.3

### Patch Changes

- Shrunk bundle size and updated deps

- Updated dependencies []:
  - node-plop@0.32.2

## 4.0.2

### Patch Changes

- Upgrade deps to be more secure

- Updated dependencies []:
  - node-plop@0.32.1

## 4.0.1

### Patch Changes

- [#408](https://github.com/plopjs/plop/pull/408) [`49c0029`](https://github.com/plopjs/plop/commit/49c00296b478efa5a212458ae1781acc93a16fa8) Thanks [@rznzippy](https://github.com/rznzippy)! - Adds --no-progress flag that disables the progress bar

## 4.0.0

### Major Changes

- [#396](https://github.com/plopjs/plop/pull/396) [`a22e33f`](https://github.com/plopjs/plop/commit/a22e33f416340352e83a1e9c0d470baf2aff1c4b) Thanks [@crutchcorn](https://github.com/crutchcorn)! - Support TypeScript config files OOTB. Drop support for Node 12, 14, & 16. Update all deps.

### Patch Changes

- Updated dependencies [[`a22e33f`](https://github.com/plopjs/plop/commit/a22e33f416340352e83a1e9c0d470baf2aff1c4b)]:
  - node-plop@0.32.0

## 3.1.2

### Patch Changes

- Append action should now allow handlebars for template path

* Fix addMany dotfile extension stripping

- Fix Inquirer TypeScript typings

* Fix empty checkboxes not bypassing properly

* Updated dependencies []:
  - node-plop@0.31.1

## 3.1.1

### Patch Changes

- Export PlopGeneratorConfig TypeScript type

## 3.1.0

### Minor Changes

- [#333](https://github.com/plopjs/plop/pull/333) [`d6176cc`](https://github.com/plopjs/plop/commit/d6176cce4ee57dfc18ad1c86ec467444e966567e) Thanks [@RobinKnipe](https://github.com/RobinKnipe)! - Added shorthand to load all Plop assets at once #333

### Patch Changes

- Updated dependencies [[`d6176cc`](https://github.com/plopjs/plop/commit/d6176cce4ee57dfc18ad1c86ec467444e966567e)]:
  - node-plop@0.31.0

## 3.0.6

### Patch Changes

- Moved to monorepo

- Updated dependencies []:
  - node-plop@0.30.1
