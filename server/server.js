const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");

const { initRenderer, render } = require("./ssr");

const isProd = process.env.NODE_ENV === "production";

const app = new express();

const resolveFromRoot = (...sections) => {
  return path.resolve(__dirname, "..", ...sections);
};
const serve = function(staticPath, cache) {
  return express.static(resolveFromRoot(staticPath), {
    maxAge: cache && true ? 30 * 24 * 60 * 60 * 1000 : 0
  });
};

app.use(favicon(resolveFromRoot("public/favicon.ico")));
app.use("/dist", serve("dist", true));
app.use("/public", serve("public", true));

const ssr = initRenderer(app);


ssr.then(({ app, renderer }) => {
  app.get("*", (req, res) => {
    if (req.url === "/") {
      res.redirect(301, '/process-pool')
    } else {
      render(req, res, renderer);
    }
  });
  const port = 3000;
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`server started at ${port}`);
  });
  // fix slow network issue
  server.keepAliveTimeout = 60000 * 2;
})




