const merge = require("webpack-merge");
const commonConfig = require("./webpack.common");
const MiniCssExtracePlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const prodConfig = {
  mode: "production",
  output: {
    filename: "js/[name]_[contenthash].js",
    chunkFilename: "js/[name]_[contenthash].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        loader: [
          {
            loader: MiniCssExtracePlugin.loader,
            options: {
              filename: "[name].css",
              chunkFilename: "[name].css",
              publicPath: "../"
            }
          },
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
  plugins: [
    new MiniCssExtracePlugin({
      filename: "css/[name]_[hash].css",
      chunkFilename: "css/[name]_[hash].chunk.css"
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          drop_console: true,
          drop_debugger: true
        }
      }),
      new OptimizeCSSAssetsWebpackPlugin({})
    ]
  }
};

module.exports = merge(commonConfig, prodConfig);
