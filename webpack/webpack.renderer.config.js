const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const baseConfig = require('./webpack.base.config');
const pkg = require('../package.json');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = merge.smart(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: ['@babel/polyfill', './src/renderer/index.tsx'],
    },
    externals: {
        electron: 'require("electron")',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        ['@babel/preset-env', { targets: { browsers: 'last 2 versions ' } }],
                        '@babel/preset-typescript',
                        '@babel/preset-react',
                    ],
                    plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
                },
            },
            {
                test: /\.(le|c)ss$/,
                exclude: /\.lazy\.(le|c)ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
            {
                test: /\.lazy\.(le|c)ss$/i,
                use: [
                    { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                    },
                  },
                ],
            }
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            reportFiles: ['src/renderer/**/*'],
        }),
        new HtmlWebpackPlugin({
            // title是不是需要改一下？？？？？
            title: pkg.title,
            // 这块需要吗？？？
            template: path.resolve(__dirname, '../src/index.ejs'),
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
            __PACKAGE_INFO_VERSION__: JSON.stringify(pkg.version),
            // 给 travis pr 构建的版本跳过更新等逻辑
            __BUILD_FOR_TRAVIS_PR__: JSON.stringify(process.env.TRAVIS_PULL_REQUEST || ''),
            __BUILD_FOR_TRAVIS_COMMIT__: JSON.stringify(process.env.TRAVIS_COMMIT || ''),
        }),
    ],
});
