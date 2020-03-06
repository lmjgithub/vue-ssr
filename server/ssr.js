const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid/v4");
const LRU = require("lru-cache");
const { createBundleRenderer } = require("vue-server-renderer");
const devServer = require("./dev-server");

const isProd = process.env.NODE_ENV === "production";
const HtmlMinifier = require("html-minifier").minify;

module.exports.initRenderer = function(app) {
  return new Promise((resolve, reject) => {
    const template = fs.readFileSync(
      path.resolve(__dirname, "../public/index.html"),
      "utf-8"
    );
    const createRenderer = (bundle, options) => {
      return createBundleRenderer(
        bundle,
        Object.assign(options, {
          basedir: path.resolve(__dirname, "../dist/web"),
          runInNewContext: false,
          shouldPreload: (file, type) => {
            console.log(type, file);
            if (type === "script") {
              return false;
            } else {
              true;
            }
          },
          shouldPrefetch: (type, file) => {
            if (type === "script") {
              return false;
            } else {
              true;
            }
          }
        })
      );
    };
    if (isProd) {
      const bundle = require(path.resolve(
        __dirname,
        "../dist/web/vue-ssr-server-bundle.json"
      ));
      const clientManifest = require(path.resolve(
        __dirname,
        "../dist/web/vue-ssr-client-manifest.json"
      ));
      const renderer = createRenderer(bundle, { template, clientManifest });

      resolve({ renderer, app });
    } else {
      devServer(app, (bundle, options) => {
        try {
          renderer = createRenderer(bundle, options);
          resolve({ renderer, app });
        } catch (error) {}
      });
    }
  });
};

const serverInfo =
  `express/${require("express/package.json").version} ` +
  `vue-server-renderer/${require("vue-server-renderer/package.json").version}`;

function renderErrorHandler({ err, req, res }) {
  const errorID = uuidv4();

  // Render Error Page or Redirect
  res
    .status(500)
    .send(
      `500 | Internal Server Error。<br/>你可以联系我们的工作人员，并把这个错误ID给他：${errorID}`
    );
}

module.exports.render = function(req, res, renderer) {
  const s = Date.now();
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Server", serverInfo);

  const context = {
    cookie: req.headers.cookie || "",
    url: req.url
  };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.error(err, req.url);

      res.send("error");
      // renderErrorHandler({ err, res, req });
    } else {
      res.send(html);
    }
  });
};

/* module.exports = app => {
  return new Promise((resolve, reject) => {
    const createRenderer = (bundle, options) => {
      return createBundleRenderer(
        bundle,
        Object.assign(options, {
          cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
          basedir: path.resolve(__dirname, "../dist/web"),
          runInNewContext: false
        })
      );
    };

    let renderer = null;

    if (isProd) {
      const template = HtmlMinifier(
        fs.readFileSync(
          path.resolve(__dirname, "../public/index.html"),
          "utf-8"
        ),
        {
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: false
        }
      );

      const bundle = require(path.resolve(
        __dirname,
        "../dist/web/vue-ssr-server-bundle.json"
      ));
      const clientManifest = require(path.resolve(
        __dirname,
        "../dist/web/vue-ssr-client-manifest.json"
      ));

      renderer = createRenderer(bundle, { template, clientManifest });
    } else {
      reject("不支持dev环境");
    }
  });
};
 */
