import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, resolve, reject) {
  if ( resolve || reject ) return originalPush.call(this, location, resolve, reject)
  return originalPush.call(this, location).catch((e)=>{})
}

export const asyncRoutes = []
export const constRouter = [

  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/resetPass',
    component: () => import('../views/resetPass.vue'),
    hidden: true //导航菜单忽略选项
  },
  {
    path: '/info',
    component: () => import('../components/StudentInfo.vue'),
    hidden: true //导航菜单忽略选项
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:constRouter
})

export default router
