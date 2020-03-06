const fs = require("fs");
const path = require("path");
const MFS = require("memory-fs");
const webpack = require("webpack");
const chokidar = require("chokidar");
const serverConfig = require("../build/webpack.server");
const clientConfig = require("../build/webpack.client");
const readline = require("readline");
const webpackDevMiddleware = require("./webpack-dev-middleware");
const webpackHotMiddleware = require("./webpack-hot-middleware");

const readFile = (fs, file) => {
  return fs.readFileSync(path.join(clientConfig.output.path, file), "utf-8");
};

module.exports = (app, cb) => {
  let bundle, template, clientManifest, serverTime, webTime;
  let isFrist = true;

  const clearConsole = () => {
    if (process.stdout.isTTY) {
      const blank = "\n".repeat(process.stdout.rows);
      console.log(blank);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
    }
  };

  const update = () => {
    if (bundle && template && clientManifest) {
      if (isFrist) {
        const url = "http://localhost:3000";
        console.log("DONE");
        const buildCommand = `npm run build`;
        isFrist = false;
      }

      cb(bundle, { template, clientManifest });
    }
  };

  // web server for ssr
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    console.log(stats.hasErrors);
    if (stats.errors.length) return;
    bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
    update();
  });
  serverCompiler.plugin("done", stats => {
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length) return;
    serverTime = stats.time;
  });

  // client
  clientConfig.entry.app = [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true",
    clientConfig.entry.app
  ];

  clientConfig.output.filename = "[name].js";
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  const clientCompiler = webpack(clientConfig);
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    stats: { colors: true },
    reporter: (middlewareOptions, options) => {
      const { log, state, stats } = options;

      if (state) {
        const displayStats = middlewareOptions.stats !== false;

        if (displayStats) {
          if (stats.hasErrors()) {
            log.error(stats.toString(middlewareOptions.stats));
          } else if (stats.hasWarnings()) {
            log.warn(stats.toString(middlewareOptions.stats));
          } else {
            log.info(stats.toString(middlewareOptions.stats));
          }
        }

        let message = "Compiled syccessfully";

        if (stats.hasErrors()) {
          message = "failed to compile";
        } else if (stats.hasWarnings()) {
          message = "compiled with warnings";
        }
        log.info(message);

        clearConsole();

        update();
      } else {
        log.info("Compiling...");
      }
    },
    noInfo: true,
    serverSideRender: false
  });

  app.use(devMiddleware);

  const templatePath = path.resolve(__dirname, "../public/index.html");

  template = fs.readFileSync(templatePath, "utf-8");

  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    console.log("index.html template updated");
    update();
  });

  clientCompiler.plugin("done", stats => {
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length) return;

    clientManifest = JSON.parse(
      readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
    );

    webTime = stats.time;
  });

  app.use(webpackHotMiddleware(clientCompiler));
};
