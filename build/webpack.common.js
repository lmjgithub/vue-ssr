const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const projectRoot = process.cwd();
function resolve(dir) {
  return path.join(__dirname, dir);
}

const assetsLoader = (outputPath = "images/") => ({
  loader: "url-loader",
  options: {
    limit: 4096,
    fallback: {
      loader: "file-loader",
      options: {
        outputPath,
        name: "[name].[hash:8].[ext]"
      }
    }
  }
});

module.exports = {
  entry: "./src/main.js",
  output: {
    path: resolve("../dist"),
    filename: "js/[name]_[chunkhash:8].js",
    chunkFilename: "js/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          { loader: "cache-loader" },
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
              optimizeSSR: false
            }
          }
        ],
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
      },
      {
        test: /\.jsx?$/,
        include: resolve("../src"),
        exclude: /node_modules/,
        use: [{ loader: "cache-loader" }, { loader: "babel-loader" }]
      },

      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [assetsLoader("images/")]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|acc)(\?.*)?$/,
        use: [assetsLoader("medias/")]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [assetsLoader("fonts/")]
      }
    ]
  },
  plugins: [
    /* new webpack.DllReferencePlugin({
      context: path.join(__dirname, "dll", "dll"),
      manifest: require("./dll/library-manifest.json")
    }), */
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({ BASE_URL: '"/"' }),
    new HtmlWebpackPlugin({
      title: "vue-law",
      template: path.join(projectRoot, "public/index.html")
    })
  ],
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          name: "vendor"
        },
        "vue-runtime": {
          test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
          name: "vue-runtime",
          priority: 30,
          enforce: true
        },
        "vendor-element-ui": {
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          name: "vendor-element-ui",
          priority: 20,
          enforce: true
        }
      }
    },
    runtimeChunk: {
      name: "webpack-runtime"
    }
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "@": resolve("../src")
    }
  }
};
