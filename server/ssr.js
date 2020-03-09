const path = require("path");
const fs = require("fs");
const { createBundleRenderer } = require("vue-server-renderer");
const devServer = require("./dev-server");

const isProd = process.env.NODE_ENV === "production";
module.exports = app => {
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
    let renderer = null;
    let isFirst = true;
    if (isProd) {
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
      devServer(app, (bundle, options) => {
        try {
          if (isFirst) {
            renderer = createRenderer(bundle, options);
            isFirst = false;
          }
          resolve(app);
        } catch (error) {}
      });
    }

    app.use(async (req, res, next) => {
      if (!renderer) {
        res.end("waiting for compilation... refresh in a moment.");
        next();
        return;
      }

      const context = {
        url: req.url,
        title: "OK"
      };
      let html;
      try {
        html = await renderer.renderToString(context);
        // html = await new Promise(resolve => {
        //   setTimeout(() => {
        //     resolve('1231');
        //   }, 3000);
        // });
      } catch (error) {}
      res.set("Content-Type", "text/html");
      res.status(200);
      res.end(html);
    });

    if (isProd) {
      resolve(app);
    }
  });
};
