const path = require('path')

const WebpackNodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
  // Target environment for bundling
  target: 'node',

  name: 'server',
  mode: 'production',

  // Let `__dirname` and `__filename` behave normally in a Node.js environment
  node: {
    __dirname: false,
    __filename: false,
  },

  resolve: {
    alias: {
      // Used for static bundle files
      public: '../build/public',
    },
  },

  // Entry file location for server side code bundling
  entry: ['./src/server.js'],

  output: {
    filename: 'server.js',
    path: path.resolve('build'),
    libraryTarget: 'commonjs2',
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
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[name]__[local]--[hash:base64:5]',
            // Needed to be set to generate class names on server side
            exportOnlyLocals: true,
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({
      // Avoid removing client bundle
      cleanOnceBeforeBuildPatterns: ['server.js'],
    }),
  ],

  // We do not need dependencies in bundle so exclude them
  externals: [WebpackNodeExternals()],
}

module.exports = config
