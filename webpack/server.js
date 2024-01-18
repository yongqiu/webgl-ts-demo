// server.js
const path = require('path'); // 调用路径
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const getConfig = require('./config.js');
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const config = getConfig({ env: 'development' });
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
).use(hotMiddleware(compiler, { log: false }));

const proxy = {
  '/api': {
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    target: 'http://30.160.70.160:80' // test
  },
};

Object.keys(proxy).forEach(function (context) {
  app.use(createProxyMiddleware(context, proxy[context]));
});

// 将文件 serve 到 port 3000。
app.listen(3030, function () {
  console.log('Example app listening on port 3030!\n');
});

