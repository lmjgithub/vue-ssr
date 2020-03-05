const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
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
  mode: isProd ? 'production' : 'development',
  output: {
    path: path.join(__dirname, '../dist/web'),
    publicPath: '/dist/web/',
    filename: "[name]_[chunkhash:8].js",
    chunkFilename: "[name].js",
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src'),
    },
    extensions: ['.js', '.vue', '.json', '.css']
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
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: [{ loader: "cache-loader" }, { loader: "babel-loader" }]
      },
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
    new CaseSensitivePathsPlugin(),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../public'),
      to: path.join(__dirname, '../dist/web'),
      ignore: ['.*', 'index.html']
    }]),
    new VueLoaderPlugin(),
  ]
}