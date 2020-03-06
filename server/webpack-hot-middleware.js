const hotMiddleware = require("webpack-hot-middleware");

module.exports = (compiler, opts = {}) => {
  opts.path = opts.path || "/__webpack_hmr";
  return hotMiddleware(compiler, opts);
  /* return function(req, res, next) {
    setTimeout(() => {
      hotMiddleware(compiler, opts)(req, res, next);
    }, 1000);
  }; */
};
