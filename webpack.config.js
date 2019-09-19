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
		  test: /\.(scss|sass)$/,
		  exclude: /node_modules/,
		  loaders: [
		    {
		      loader: 'css-loader',
		      options: {
		        modules: {
			        localIdentName: '[local]___[hash:base64:5]'		        	
		        },
		        sourceMap: true,
		        importLoaders: 1
		      }
		    },
		   'sass-loader'
		  ]
		},
		{
			test: /\.css$/,
			use: ['style-loader','css-loader']
		},
		{
		    test: /\.(svg|png|jpg|jpeg|gif)$/,
		    use: {
		        loader: 'file-loader',
		        options: {
		            name: '[name].[ext]',
		            outputPath: 'images'
		        }
		    }
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