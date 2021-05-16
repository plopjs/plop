const webpack = require('webpack');

class FallbackRequireWebpackPlugin {
  apply(compiler) {
	compiler.hooks.compilation.tap('FallbackRequireWebpackPlugin', (compilation) => {
		const {renderRequire} = webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation);
		renderRequire.tap(
			'FallbackRequireWebpackPlugin',
			(content, renderContext) => content.replace(
				/\s*return module\.exports;\s*/,
				'\nreturn (module.exports && module.exports.name === "webpackEmptyContext") ? require(moduleId) : module.exports;',
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
	module: {
		rules: [
			// Replace require extension supports
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
