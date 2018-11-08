const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = WebpackMerge(common, {
	mode: 'production',
	optimization: {
		minimizer: [
			new UglifyJSWebpackPlugin({
				uglifyOptions: {
					ie8: false,
					compress: true,
					mangle: true,
					warnings: false,
					parallel: true,
					cache: true,
					sourceMap: true
				}
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].[hash].css",
			chunkFilename: "[id].[hash].css"
		})
	]
});