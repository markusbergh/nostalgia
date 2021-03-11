const path = require('path')
const webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const keys = require('./webpack.env')

const config = {
  // Target environment for bundling
  target: 'web',

  name: 'client',
  mode: 'development',

  // Entry file location for client code bundling
  entry: ['./src/client.js'],

  output: {
    filename: 'client.js',
    path: path.resolve('build/public'),
    publicPath: '/',
  },

  devtool: 'eval-cheap-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // Set environment keys for the client
    new webpack.DefinePlugin(keys),
    new CleanWebpackPlugin(),
  ],
}

module.exports = config
