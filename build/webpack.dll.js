const webpack = require("webpack");
const path = require("path");

const library = ["vue", "vuex", "vue-router", "element-ui", "axios"];

module.exports = {
  entry: { library },
  output: {
    path: path.join(__dirname, "dll"),
    filename: "[name]_[chunkhash].dll.js",
    library: "[name]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dll", "[name]-manifest.json"),
      name: "[name]_[hash]"
    })
  ]
};
