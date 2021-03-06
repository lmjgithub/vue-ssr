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
        cb(bundle, { template, clientManifest });
      }

    }
  };

  // web server for ssr
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  // 
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;
    bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
    update();
  });
  // 计算服务更新时间
  // serverCompiler.hooks.done.tap("webpack-dev-server", stats => {
  //   stats = stats.toJson();
  //   stats.errors.forEach(err => console.error(err));
  //   stats.warnings.forEach(err => console.warn(err));
  //   if (stats.errors.length) return;
  //   serverTime = stats.time;
  // });

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
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  });

  app.use(devMiddleware);

  const templatePath = path.resolve(__dirname, "../public/index.html");

  template = fs.readFileSync(templatePath, "utf-8");

  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    console.log("index.html template updated");
    update();
  });

  clientCompiler.hooks.done.tap("webpack-dev-server", stats => {
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    if (stats.errors.length) return;

    clientManifest = JSON.parse(
      readFile(devMiddleware.fileSystem, "vue-ssr-client-manifest.json")
    );
    update();
    webTime = stats.time;
  });

  app.use(
    webpackHotMiddleware(clientCompiler, {
      log: console.log,
      path: "/__webpack_hmr",
      heartbeat: 10 * 1000
    })
  );
};
