const hotMiddleware = require("webpack-hot-middleware");
const PassThrough = require("stream").PassThrough;

module.exports = (compiler, opts = {}) => {
  opts.path = opts.path || "/__webpack_hmr";

  const middleware = hotMiddleware(compiler, opts);

  return (req, res, next) => {
    if (req.path !== opts.path) {
      return next();
    }

    const stream = new PassThrough();
    // res = stream;

    middleware(req, res, next);
  };
};
