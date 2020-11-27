const { createBundleRenderer } = require('vue-server-renderer')
const express = require('express')
const { resolve } = require('path')
const serverBundle = require(resolve(__dirname, '../dist/vue-ssr-server-bundle.json'))
const clientManifest = require(resolve(__dirname, '../dist/vue-ssr-client-manifest.json'))
const template = require('fs').readFileSync(resolve(__dirname, '../dist/index.ssr.html'), 'utf-8')

const app = express()

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template, // （可选）页面模板
  clientManifest // （可选）客户端构建 manifest
})

// 在服务器处理函数中……
app.get('*', (req, res) => {
  if (req.url === '/favicon.ico') return
  const context = { url: req.url }
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  renderer.renderToString(context, (err, html) => {
    // 处理异常……
    res.end(html)
  })
})

const port = process.env.PORT || 8085
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})