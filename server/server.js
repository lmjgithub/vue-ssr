const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");

const SSR = require("./ssr");

const app = new express();

/* const resolveFromRoot = (...sections) => {
  return path.resolve(__dirname, "..", ...sections);
};
const serve = function(staticPath, cache) {
  return express.static(resolveFromRoot(staticPath), {
    maxAge: cache && true ? 30 * 24 * 60 * 60 * 1000 : 0
  });
}; */

SSR(app).then(server => {
  const port = 3000;
  server.listen(port, "0.0.0.0", () => {
    console.log(`server started at ${port}`);
  });
});
