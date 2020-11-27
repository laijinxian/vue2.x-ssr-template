// server/ssr.js
const Koa = require("koa");
const KoaStatis = require("koa-static");
const path = require("path");

const resolve = file => path.resolve(__dirname, file);
const app = new Koa();

const isDev = process.env.NODE_ENV !== "production";
const router = isDev ? require("./setup-dev-server.js") : require("./index.js");

app.use(router.routes()).use(router.allowedMethods());

// 开放目录
app.use(KoaStatis(resolve("../dist")));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started at localhost: ${port}`);
});

module.exports = app;