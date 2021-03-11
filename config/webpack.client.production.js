const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack')

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const keys = require('./webpack.env')

const config = {
  // Target environment for bundling
  target: 'web',

  name: 'client',
  mode: 'production',

  // Entry file location for client code bundling
  entry: ['./src/client.js'],

  output: {
    filename: 'client.[contenthash].js',
    path: path.resolve('build/public'),
    publicPath: '/',
  },

  // No need to output so much information
  stats: 'errors-warnings',

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
          MiniCssExtractPlugin.loader,
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
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // Will output bundle names for server to pick up
    new StatsWriterPlugin({
      transform(data, opts) {
        return JSON.stringify(
          {
            css: data.assetsByChunkName.main[0],
            js: data.assetsByChunkName.main[1],
          },
          null,
          2
        )
      },
    }),
    new CleanWebpackPlugin(),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // Exclude comments and disable generating LICENSE file
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
}

module.exports = config
