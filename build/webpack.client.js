const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base')
const path = require("path");
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const isProd = process.env.NODE_ENV === 'production'


module.exports = merge(base, {
  name: 'client',
  devtool: '#eval-source-map',
  entry: {
    app: path.resolve(__dirname, '../src/entry-client.js')
  },
  mode: isProd ? 'production' : 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ]
})