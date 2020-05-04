const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');


module.exports = {
  mode: 'development',
  devtool: 'source-map',
  module: {
      rules
  },
  plugins: plugins,
  resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  },
  target: 'web',
  entry: './src/web/index.ts',
  output: {
    path: path.resolve(__dirname, ".webpack/web"),
    filename: "index.js",
  },
  devServer: {
    open: true,
  },
  plugins: [
    ...plugins,
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './public/index.html',
      filename: 'index.html'
    }),
  ],
};
