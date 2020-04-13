const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/main.ts',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: '/node/modules/'
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					attributes: {
						list: [
							{
								tag: 'img',
								attribute: 'src',
								type: 'src'
							}
						]
					}
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|svg|jpg)$/,
				loader:'file-loader',
				options: {
					name: 'assets/images/[name].[ext]'
				}
			},
			{
				test: /\.(obj|mtl)$/,
				loader:'file-loader',
				options: {
					name: 'assets/models/[contenthash].[ext]'
				}
			},
			{
				test: /\.(ttf)$/,
				loader:'file-loader',
				options: {
					name: 'assets/fonts/[name].[ext]'
				}
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			favicon: 'src/favicon.ico'
		})
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
