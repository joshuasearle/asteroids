const path = require('path');

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');

const config = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'assets'),
    publicPath: '/',
    compress: true,
    port: 8080,
  },
});

module.exports = config;
