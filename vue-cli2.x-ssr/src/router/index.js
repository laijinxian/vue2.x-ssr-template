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
