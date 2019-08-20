let path = require('path');
let nodeExternals = require('webpack-node-externals');

const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const moduleObj = {
	rules: [{
		test: /\.js$/,
		exclude: /node_modules/,
		use: ['babel-loader'],
		},
		{
		test: /\.css$/,
		use: ['style-loader','css-loader']
		}]
};

const client = {
	entry: {
		'client': './src/client/index.js'
		},
	target: 'web',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist/public')
		},
	module: moduleObj,
	plugins: [
		new HtmlWebPackPlugin({
			template: 'src/client/index.html'
			})
		],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
			        name: 'vendors',
			        chunks: 'all'
			    }
			}
		}
	}
};

const server = {
	entry: {
		'server': './src/server/index.js'
		},
	target: 'node',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
		},
	module: moduleObj,
	externals: [nodeExternals()]
};

module.exports = [client, server];