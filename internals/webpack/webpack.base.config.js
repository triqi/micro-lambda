const path = require('path');
const serverlessWebpack = require('serverless-webpack');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = options => ({
  entry: serverlessWebpack.lib.entries,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'commonjs2',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.html$/,
        use: [{ loader: 'file-loader', options: { name: '[path][name].[ext]' } }],
      },
      {
        test: /\.docs.(yml|yaml)$/,
        use: [{ loader: 'file-loader', options: { name: '[path][name].[ext]' } }],
      },
    ],
  },
  externals: [webpackNodeExternals()],
  mode: options.mode,
  devtool: options.devtool,
});
