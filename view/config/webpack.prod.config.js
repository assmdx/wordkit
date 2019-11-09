const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

let webpackConfig = {
    entry: {
        dashboard:path.resolve(__dirname, '../src/dashboard/index.js'),
    },
    output:{
        path:path.resolve(__dirname, '../dist/'),
        filename:'dashboard.js'
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename:`./dashboard.html`,
            template:path.join(__dirname, `./index.html`),
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    }
};


module.exports = webpackConfig;
