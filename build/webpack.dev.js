const merge = require("webpack-merge");
const webpack = require("webpack");
const commonConfig = require("./webpack.common");

const devConfig = {
  mode: "development",
  output: { filename: "[name].js", chunkFilename: "[name].js" },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        loader: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 2 }
          },
          "less-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: "../dist",
    hot: true,
    stats: "errors-only",
    historyApiFallback: true
  },
  devtool: "cheap-source-map"
};

module.exports = merge(commonConfig, devConfig);
