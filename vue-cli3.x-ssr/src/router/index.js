import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home'

Vue.use(VueRouter);

/**
 * TODO 
 * 注意： 默认路由不要使用懒加载 component: () => import('../views/About')， 后续路由可以
 * 不然会报错 repalce ...  router ...  错什么的； 
 */

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: 'about' */ '../views/About')
  }
];

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    routes
  })
}
