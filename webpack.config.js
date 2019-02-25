// Init Variable
const isProduction = process.env.NODE_ENV === 'production';
const postCssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: () => {
            return [
                require('autoprefixer')
            ];
        }
    }
};

// Load Nodejs Module
const Path = require('path');

// Load Webpack Plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Webpack = require('webpack');

// Plugins Instance
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: './src/static/index.html',
    filename: 'index.html',
    hash: true
});

const miniExtractSass = new MiniCssExtractPlugin({
    filename: 'style.css',
    disable: isProduction ? false : true
})

// Init cssLoader Variable
const cssLoaders = isProduction ?
    [MiniCssExtractPlugin.loader, 'css-loader', postCssLoader, 'sass-loader'] :
    ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }, postCssLoader, 'sass-loader'];

const cleanWebpackPlugin = new CleanWebpackPlugin([Path.resolve(__dirname, 'dist/*')], {
    verbose: true
})

const namedModulesPlugin = new Webpack.NamedModulesPlugin();

const hotModuleReplacementPlugin = new Webpack.HotModuleReplacementPlugin();

module.exports = {
    entry: './src/assets/scripts/index.jsx',
    output: {
        filename: 'index.min.js',
        path: Path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: Path.resolve(__dirname, 'dist'),
        compress: true,
        hot: true,
        port: 5656,
        open: true
    },
    resolve: {
        modules: [
            Path.resolve(__dirname, 'src/assets/scripts'),
            'node_modules'
        ],
        extensions: [
            '.js',
            '.jsx'
        ]
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssLoaders
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_module/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        plugins: [
                            'transform-class-properties'
                        ],
                        presets: [
                            'stage-3',
                            'stage-2',
                            'stage-1',
                            'stage-0',
                            'es2017',
                            'es2016',
                            'es2015',
                            'env',
                            'react'
                        ]
                    }
                }
            }, {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    plugins: [
        miniExtractSass,
        htmlWebpackPlugin,
        cleanWebpackPlugin,
        namedModulesPlugin,
        hotModuleReplacementPlugin
    ]
}