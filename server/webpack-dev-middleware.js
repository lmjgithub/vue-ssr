const webpackDevMiddleware = require("webpack-dev-middleware");

module.exports = (compiler, opts) => {
  const expressMiddleware = webpackDevMiddleware(compiler, opts);

  function middleware(req, res, next) {
    expressMiddleware(
      req,
      {
        end: content => {
          res.end(content);
        },
        setHeader: (name, value) => {
          console.log(name,value)
          res.setHeader(name,value)
        }
      },
      next
    );
  }

  middleware.getFilenameFromUrl = expressMiddleware.getFilenameFromUrl
  middleware.waitUntilValid = expressMiddleware.waitUntilValid
  middleware.invalidate = expressMiddleware.invalidate
  middleware.close = expressMiddleware.close
  middleware.fileSystem = expressMiddleware.fileSystem

  return middleware;
};
