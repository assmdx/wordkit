'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    output: {
      // ????这块目录需要改一下
      path: path.resolve(__dirname, '../app/dist'),
        filename: '[name].js',
    },
    // 这个是做啥的
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    devtool: 'source-map',
    plugins: [],
};