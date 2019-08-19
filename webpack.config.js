let path = require('path');
let nodeExternals = require('webpack-node-externals');
let combineLoaders = require('webpack-combine-loaders');

const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const moduleObj = {
	rules: [{
		test: /\.js$/,
		exclude: /node_modules/,
		loaders: ["babel-loader"],
		},
		{
		test: /\.css$/,
		loader: combineLoaders([
			{
				loader: 'style-loader'
			}, {
				loader: 'css-loader',
			    query: {
			    	modules: true
			    }
			}])
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
		]
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