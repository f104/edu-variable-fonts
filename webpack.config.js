/**
 * Webpack main configuration file
 */

const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const environment = require('./configuration/environment')

const templateDir = path.resolve(environment.paths.source, 'views')
const templateFiles = fs
    .readdirSync(templateDir)
    .filter((fileName) => fileName.endsWith('.pug'))
const htmlPluginEntries = templateFiles.map(
    (file) =>
        new HTMLWebpackPlugin({
            template: `${templateDir}/${file}`,
            filename: `./${file.replace(/\.pug/, '.html')}`,
        })
)

module.exports = {
    entry: {
        app: path.resolve(environment.paths.source, 'js', 'app.js'),
    },
    output: {
        filename: 'js/[name].js',
        path: environment.paths.output,
    },
    module: {
        rules: [
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.pug/,
                use: ['pug-loader'],
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: environment.limits.fonts,
                    },
                },
                generator: {
                    filename: 'css/fonts/[name].[hash:6][ext]',
                },
            },
            {
                test: /\.font\.js/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    'webfonts-loader',
                ],
            },
            {
                test: /\.svg$/,
                include: path.resolve(environment.paths.source, 'svgsprite'),
                use: [
                  { loader: 'svg-sprite-loader' },
                ]
              }
        ],
    },
    optimization: {
        minimizer: [
            '...',
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['jpegtran', { progressive: true }],
                            ['optipng', { optimizationLevel: 5 }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            [
                                'svgo',
                                {
                                    plugins: [
                                        {
                                            name: 'removeViewBox',
                                            active: false,
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new ImageminWebpWebpackPlugin({
            config: [
                {
                    test: /\.(jpe?g|png)/,
                    options: {
                        quality: 100,
                    },
                },
            ],
            overrideExtension: true,
            detailedLogs: false,
            silent: false,
            strict: true,
        }),
        new SpriteLoaderPlugin(),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(environment.paths.source, 'assets'),
                    to: path.resolve(environment.paths.output, 'assets'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
            ],
        }),

        ...htmlPluginEntries,
    ],
    target: 'web',
}
