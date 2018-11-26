const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const devMode = process.env.NODE_ENV === 'development';

module.exports = {
	entry: {
		app: path.resolve(__dirname, '../src/index.ts'),
	},
	output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, '../dist')
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(png|svg|jpe*g|gif|mp3|ogg|ttf|woff|woff2|ico)$/, // obj | mtl raw files etc...
				use: [
					{
						loader: 'file-loader',
						options: {
							name() {
								return devMode ? '[path][name].[ext]' : '[hash].[ext]';
							},
							outputPath: devMode ? '' : 'src/'
						}
					}
				]
			},
			{
				test: /\.html$/i,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: !devMode
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'pepjs': path.resolve(__dirname, '../node_modules/pepjs/dist/pep.min.js')
		}
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '../')
		}),
		new HtmlWebpackPlugin({
			title: 'abc',
			template: path.resolve(__dirname, '../src/index.html'),
			favicon: path.resolve(__dirname, '../src/favicon.ico'),
		}),
		new MiniCssExtractPlugin({
			filename: devMode ? '[name].css' : '[name].[hash].css',
			chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, '../src/assets'),
				to: 'assets'
			}
		])
	],
	optimization: {
		namedChunks: true,
		splitChunks: {
			name: 'vendor',
			filename: 'common.js',
			chunks: 'all',
			cacheGroups: {
				commons: {
					name: 'commons',
					chunks: 'initial',
					minChunks: 4
				}
			}
		}
	},
	// externals: {
	// 	"oimo": true,
	// 	"cannon": true,
	// 	"earcut": true
	// }
};