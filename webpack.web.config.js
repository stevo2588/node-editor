const HtmlWebpackPlugin = require('html-webpack-plugin');
const renderer = require('./webpack.renderer.config');

module.exports = {
  ...renderer,
  target: 'web',
  entry: {
    main: './src/client/index.tsx',
  },
  devServer: {
    open: true,
  },
  plugins: [
    ...renderer.plugins,
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './public/index.html',
      filename: 'index.html'
    }),
  ],
};
