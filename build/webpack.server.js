const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const base = require('./webpack.base');

module.exports = merge(base, {
  name: 'server',
  target: 'node',
  devtool: '#cheap-module-source-map',
  mode: 'production',
  entry: path.join(__dirname, '../src/entry-server.js'),
  output: {
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: [/\.vue$/, /\.(css|less)$/]
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"',
    }),
    new VueSSRServerPlugin()
  ]
})


