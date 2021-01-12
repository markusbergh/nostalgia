const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack')

const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const env = dotenv.config().parsed

// Helper function to set environmental keys
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next])

  return prev
}, {})

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
    // Get environment keys for the client
    new webpack.DefinePlugin(envKeys),
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
