const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack')

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
    // Get environment keys for the client
    new webpack.DefinePlugin(envKeys),
    new CleanWebpackPlugin(),
  ],
}

module.exports = config
