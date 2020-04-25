/**
 * This is the main entry point for your application, it's the first file
 * that runs in the main process.
 */

const rules = require('./webpack.rules');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: 'development',
    devtool: 'source-map',
    target: 'electron-main',
    entry: './src/main.ts',
    module: {
        rules
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
    },
    plugins: [
        new CopyPlugin([
            'src/preload.js',
        ]),
    ],
};
