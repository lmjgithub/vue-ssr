const webpackDevMiddleware = require("webpack-dev-middleware");

module.exports = (compiler, opts) => {
  const expressMiddleware = webpackDevMiddleware(compiler, opts);
  return expressMiddleware;
};
