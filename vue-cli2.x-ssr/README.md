参考官方文档效果更佳 [vue SSR](https://ssr.vuejs.org/zh/) 

## 为什么加 SSR: 
- 大屏数据可视化需求（`地图、各种表格、饼图、动画`之类的）
- 加上后台查数据往往获取的是`所有数据、整年、整月、整天`等数据
- `数据量太大`，加上动画的渲染导致完全呈现能交互的页面等待的时间有点...
- `构建过程中坑挺多`， 可参考源码目录及版本信息，实在不行 `clone` 项目 代码配置全删，自己配一遍
- 作为`面试`热门、 优化项目的重要手段；必须的学啊
- `注意`：不建议对成熟项目上加`ssr`, 改动太大，一定会影响；建议单独起项目给需要 `ssr` 的页面 抽离，在聚合
- 下篇文章 `vue-cli3 ssr` 及 热重载
- `源码地址`：https://github.com/laijinxian/vue-ssr-template  来个 star 呗
## vue SSR 现有的方案有：
- `Nuxt.js`: 依赖于 `Nuxt.js` 构建项目
- `vue-server-renderer` (`文章所选`); 易于扩展， 也利于自己对 `ssr` 更为的了解
- 替代方案：`prerender-spa-plugin` （预渲染） 也是个不错的选择

## 一、客户端渲染、服务端渲染区别及原理
> - **客户端渲染**： vue 通过 虚拟DOM 在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM
> - **服务端渲染**： 将一个组件渲染为服务器端的 **HTML 字符串**（只有HTML结构），将它们直接发送到浏览器；在结合css、js将这些静态标记加上样式及交互进而"激活"为客户端上完全可交互的应用程序

## 二、 SSR 优点：
> **更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面**  

原因： 客户端渲染如果你的应用程序初始展示 `loading` 菊花图，然后通过 `Ajax` 获取内容，抓取工具并不会等待异步完成后再行抓取页面内容。               
所以搜索引擎并无有抓取到你网站的重要信息，抓取到的只是最初始的没有内容的`index.html`结构；

> **更好的用户体验、提升用户留存率**

原因： 当一个页面在3s内还未看到感兴趣的内容，大多数人都是直接退出页面；更快的内容到达时间，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面；尤其是初始渲染需要加载许多外链js、css的页面尤为突出优势；

## 三、SSR 不足之处：
> **开发条件所限**

原因： 浏览器特定的代码（除`beforeCreate、Create` 生命周期外服务端都不执行，`window、document`不存在、一些监听函数内存无法及时释放如定时器及`addEventListener`）                  
只能在某些生命周期钩子函数中使用；一些外部扩展库可能需要特殊处理，才能在服务器渲染应用程序中运行；            
因为SSR服务器直接吐出`html`字符串就好了，不会渲染`DOM`结构，所以不存在`beforeMount`和`mounted`的，也不会对其进行更新

> **开发难度增加、项目的构建、配置、部署**

原因： 需要懂`node`技术、区别客户端、服务端分别进行配置及部署；开发中也需要及时注意内存问题、及服务器压力

> **更多的服务器端负载**

原因： 在 `Node.js` 中渲染完整的应用程序，显然会比仅仅提供静态文件的 `server` 更加大量占用 `CPU` 资源，因此如果你预料在高流量环境 下使用，请准备相应的服务器负载，并明智地采用缓存策略

#### 四、SSR 注意点：
> **异步获取数据问题**
- 通过服务端预先获取所有需要的数据存储到`Vuex`中，浏览器端渲染时直接冲`vuex`取值渲染页面。

> **子组件依赖父组件接口数据**
- 组件生命周期`beforeCreate、Create`会执行2次， 服务端和客户端都会执行；所以页面数据赋值操作应放在`mounted`生命周期中，这样子组件才能获取到父组件传递的最新数据

> **流式传输 `renderToStream`**
- `renderToStream` 应用`bigpipe`技术可以向浏览器持续不断的返回一个流；文件的加载浏览器可以尽早的显示一些东西出来，对于一些不用实时依据后台数据和静态页面友好
- 依赖由组件生命周期钩子函数填充的上下文数据，则不建议使用流式传输模式
- `renderToString` 适应用一些需实时依据后台接口数据渲染的页面

> **页面级别缓存** 总是为所有用户渲染相同的内容 [官方文档](https://ssr.vuejs.org/zh/guide/caching.html#%E9%A1%B5%E9%9D%A2%E7%BA%A7%E5%88%AB%E7%BC%93%E5%AD%98-page-level-caching)
- **Node.js 中实现**: 利用名为 `micro-caching` 的缓存策略，来大幅度提高应用程序处理高流量的能力

> **组件级别缓存**  [官方文档](https://ssr.vuejs.org/zh/guide/caching.html#%E7%BB%84%E4%BB%B6%E7%BA%A7%E5%88%AB%E7%BC%93%E5%AD%98-component-level-caching)
- **lru-cache**: `serverCacheKey: props => props.item.id`; 
- 必须定义一个唯一的 `name` 选项,过使用唯一的名称，每个缓存键 (cache key) 对应一个组件：你无需担心两个组件返回同一个 key

## 四、 正式开始， 代码改造
> 代码具体为什么要这样改造， 可查阅 `官方文档` 解释的更加详细
### 1. vue-router 暴露出构造函数于服务器调用
```
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [{
      path: '/',
      name: 'HelloWorld',
      component: () => import('@/pages/HelloWorld')
    },
    {
      path: '/item',
      name: 'Item',
      component: () => import('@/pages/Item')
    }]
  })
}
```
### 2. `app.js` 我把`main.js` 改成了 `app.js` ，相对应`webpac`配置要改过来.
```
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
Vue.mixin({
  beforeMount () {
    const { asyncData } = this.$options
    if (asyncData) {
      // 将获取数据操作分配给 promise
      // 以便在组件中，我们可以在数据准备就绪后
      // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
      this.dataPromise = asyncData({
        store: this.$store,
        route: this.$route
      })
    }
  }
})
// 导出一个工厂函数，用于创建新的
export function createApp () {
  // 创建 router 和 store 实例
  const router = createRouter()
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  // 创建应用程序实例，将 router 和 store 注入
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // 暴露 app, router 和 store。
  return { app, router, store }
}
```
### 3. src 下新增 entry-client.js 及 entry-server.js
```
// entry-client.js
import { createApp } from './app'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    // 这里如果有加载指示器 (loading indicator)，就触发

    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {
      // 停止加载指示器(loading indicator)
      next()
    }).catch(next)
  })
  app.$mount('#app', true)
})
```
```
// entry-server.js
import { createApp } from './app'
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error({ code: 404 }))
      }

      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
``` 
### 4. `build` 下 新增  `webpack.client.conf.js` 及 `webpack.server.conf.js`
```
// webpack.client.conf.js
const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
  entry: {
    client: path.resolve(__dirname, '../src/entry-client.js')
  },
  plugins: [
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "manifest",
    //   minChunks: Infinity
    // }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/template/index.html'),
      filename: 'index.html'
    })
  ]
})
```
```
const webpack = require("webpack")
const path = require('path')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: {
    server: path.resolve(__dirname, '../src/entry-server.js')
  },

  // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',

  // 对 bundle renderer 提供 source map 支持
  devtool: 'source-map',

  // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
  output: {
    libraryTarget: 'commonjs2'
  },

  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // 外置化应用程序依赖模块。可以使服务器构建速度更快，
  // 并生成较小的 bundle 文件。
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    allowlist: /\.css$/
  }),

  // 这是将服务器的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-server-bundle.json`
  plugins: [
    new VueSSRServerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/template/index.ssr.html'),
      filename: 'index.ssr.html',
      inject: true,
      files: {
        js: 'client.js'
      },
      excludeChunks: ['server']
    })
  ]
})
```
#### 5. 新增 index.ssr.html <!--vue-ssr-outlet--> 注释很重要不能删
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>服务端渲染</title>
</head>
<body>
  <!--vue-ssr-outlet-->
  <script type="text/javascript" src="<%= htmlWebpackPlugin.options.files.js %>"></script>
</body>
</html>
```

### 6. 增加服务端 server/index.js
```
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
```
### 7. 增加package.json 打包命令
```
"scripts": {
  "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
  "start": "node server/index.js",
  "unit": "jest --config test/unit/jest.conf.js --coverage",
  "e2e": "node test/e2e/runner.js",
  "test": "npm run unit && npm run e2e",
  "lint": "eslint --ext .js,.vue src test/unit test/e2e/specs",
  "build": "rimraf dist && npm run build:client && npm run build:server",
  "build:client": "webpack --config build/webpack.client.conf.js",
  "build:server": "webpack --config build/webpack.server.conf.js"
},
```
### 8. 注释  webpack.base.conf.js 下的 entry 配置
```
...
module.exports = {
  context: path.resolve(__dirname, '../'),
  // entry: {
  //   app: './src/main.js'
  // },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  ......
}
....
```

### 9. 构建 
- `yarn run build` or `npm run build`
- `yarn run start` or `npm run start`
- 浏览器输入`http://localhost:8085/` 即可看到效果

### 10. 如何查看 是否服务端渲染成功
打开浏览器控制台 `network` 选择 `All` 你会看到如下界面， 对应路由 `preview` 返回的是不包含`css`的页面结构 （浏览器渲染返回的是 `index.html` 内容）
![](https://imgkr2.cn-bj.ufileos.com/879392e9-964e-46a6-a496-1d89046f416d.jpg?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=fujKu9rS%252BhOxP2rreW4YTXoZ0Us%253D&Expires=1606446507)

## 五、 建议
- 自己搭建的过程中遇到的坑还是很多的；目前在弄 `vue-cli3` 的 `ssr` 及 热重载 也是坑多； 所以具体哪些坑有些忘了
- 假如有遇到坑的朋友，可以留言、或者 `github` 提 `Issues` ， 及时回复
- 大多数问题个人感觉都是 插件包 版本问题，相互影响， 可参考我的源码结构及版本 
- 下篇文章 `vue-cli3 ssr` 及 热重载


