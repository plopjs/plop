const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const {get, set} = require('lodash');

const config = module.exports = require('webpack-config-prefabs').nodeLibrary(module, {
    entry: './bin/plop.js'
});

get(config, 'resolve.plugins') || set(config, 'resolve.plugins', []);
get(config, 'resolveLoader.plugins') || set(config, 'resolveLoader.plugins', []);
config.resolve.plugins.unshift(PnpWebpackPlugin);
config.resolveLoader.plugins.unshift(PnpWebpackPlugin.moduleLoader(module));
