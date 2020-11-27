// // entry-server.js
import { createApp } from './main'

// 导出函数将由 bundlerender 调用
// 数据预取是异步的，所以应该返回一个Promise
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url);

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
     
      const matchedComponents = router.getMatchedComponents();

      // 匹配不到的路由，执行 reject 函数，返回错误
      if (!matchedComponents.length) {
        // 做点什么
        // vue-cli3 直接reject 会导致引入文件错误
        // return reject(new Error({ code: 404 }))
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
        context.rendered = () => {
          context.state = store.state
        }
        resolve(app)
      }).catch(reject)
      resolve(app)
    }, reject)
  })
}

