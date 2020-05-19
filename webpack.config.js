const webpack = require('webpack');
const {join} = require('path');

module.exports = {
	target: 'node',
	context: __dirname,
	entry: './src/plop.js',
	output: {
		path: join(__dirname, 'dist'),
		filename: 'plop.js',
		libraryTarget: 'commonjs2',
	},
	mode: 'production',
	devtool: false,
	optimization: {
		minimize: true,
	},
	// Do not provide fake versions of process, __dirname, etc.
	node: false,
	resolve: {
		extensions: ['.js'],
	},
	module: {
		rules: [
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
	plugins: [new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })],
};