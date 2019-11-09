const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pageConfig = ["dashboard"];

let webpackConfig = {
    context: path.resolve(__dirname, '../'),
    entry: {},
    plugins:[],
    devServer: {
        index:'/',
        contentBase: path.resolve(__dirname, '../dist/dashboard.html'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env','react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    }
};

if(pageConfig && Array.isArray(pageConfig)){
    pageConfig.map(page=>{
        webpackConfig.entry[page] = `./src/${page}/index.js`;
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            filename:`./${page}.html`,
            template:`./index.html`,
            hash:true,
            chunks:[`${page.name}`]
        }))
    })
}

module.exports = webpackConfig;
