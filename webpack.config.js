const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");

// A webpack plugin that falls back to the default require if the module isn't bundled.
// - Useful for configuration files from the end user on Node.js
// - If this breaks, we can either patch it, or decide to not bundle in the next release
class FallbackRequireWebpackPlugin {
	apply (compiler) {
		compiler.hooks.compilation.tap('FallbackRequireWebpackPlugin', (compilation) => {
			// Permalink for undocumented plugin compilation hook map:
			// https://github.com/webpack/webpack/blob/v5.37.0/lib/javascript/JavascriptModulesPlugin.js#L123-L165
			const {renderRequire} = webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation);
			// Permalink for undocumented plugin compilation hook:
			// https://github.com/webpack/webpack/blob/v5.37.0/lib/javascript/JavascriptModulesPlugin.js#L1178-L1264
			renderRequire.tap(
				'FallbackRequireWebpackPlugin',
				// Replaces `module.exports` with a commonjs `require`, or a proxy that falls back to it, when the
				// exports is a function that will error during runtime
				// - Another solution could be to mutate the prototype of `ContextModule`
				//   (e.g. `ContextModule.prototype.getSourceForEmptyContext = () => 'module.exports = require;';`)
				(content) => content.replace(
					/\s*return module\.exports;\s*/,
					`
if (typeof module.exports === "function") {
	if (module.exports.name === "webpackEmptyContext") {
		module.exports = require;
	} else if (module.exports.name === "webpackEmptyAsyncContext") {
		module.exports = async (...args) => require(...args);
	} else if (module.exports.name === "webpackContext") {
		const originalExport = module.exports;
		module.exports = new Proxy(originalExport, {
			apply (target, thisArg, args) {
				try {
					Reflect.apply(target, thisArg, args);
				} catch (error) {
					Reflect.apply(require, thisArg, args);
				}
			}
		});
	} else if (module.exports.name === "webpackAsyncContext") {
		const originalExport = module.exports;
		module.exports = new Proxy(originalExport, {
			async apply (target, thisArg, args) {
				try {
					await Reflect.apply(target, thisArg, args);
				} catch (error) {
					Reflect.apply(require, thisArg, args);
				}
			}
		});
	}
}
return module.exports;
`,
				),
			);
		});
	}
}

module.exports = {
	mode: 'production',
	target: 'node',
	context: __dirname,
	entry: {
		main: {
			import: './src/plop.js',
			filename: './dist/plop.js',
		},
		entry: {
			dependOn: 'main',
			import: './src/index.js',
			filename: './dist/index.js',
			library: {
				// The entry point of the module should be accessible via commonjs while the rest relies on the webpack
				// runtime install chunk
				type: 'commonjs2',
			},
		},
		bin: {
			dependOn: 'main',
			import: './src/bin/plop.js',
			filename: './bin/plop.js',
		},
	},
	output: {
		path: __dirname,
	},
	devtool: false,
	// Do not provide fake versions of process, __dirname, etc.
	node: false,
	resolve: {
		extensions: ['.js'],
	},
	externalsPresets: {
		node: true,
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_fnames: /^webpack(?:Empty)?(?:Async)?Context$/,
				},
			}),
		],
	},
	module: {
		rules: [
			// Replace `require.extension` uses
			// - Makes sure packages using the deprecated `require.extensions["ts"] = something` will not generate
			//   Webpack require code
			{
				test: /\.js$/,
				loader: 'string-replace-loader',
				options: {
					search: '\\brequire\\.extensions\\b',
					replace: '__non_webpack_require__.extensions',
					flags: 'g',
				},
			},
			// Replace all shebangs with an empty line
			{
				test: /\.js$/,
				loader: 'string-replace-loader',
				options: {
					search: '^#![^\n]*?\n',
					replace: '\n',
					flags: '',
				},
			},
		],
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: '#!/usr/bin/env node',
			raw: true
		}),
		new FallbackRequireWebpackPlugin(),
	],
};
