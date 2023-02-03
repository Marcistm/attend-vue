// 路由的全局守卫

// 权限控制逻辑
import router from './index'
import store from '../store/index'

//引入nprogress 进度条插件
import NProgress from 'nprogress'

import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 从cookie获取令牌

// 简单配置  进度条
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })


const whiteList = ['/'] //排除的路径

router.beforeEach(async (to,from,next) => {
    NProgress.start()
    try {
        const hasToken = getToken()
        if(hasToken){
            if(to.path === '/'){
                next({path: '/home'})
            }else{
                const hasRoles = store.getters.roles && store.getters.roles.length > 0
                if(hasRoles){
                    next()
                } else {
                    const { roles } = await store.dispatch('user/getInfo')
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                    router.addRoutes(accessRoutes)
                    next({...to,replace: true})
                }
            }
        }else{
            if(whiteList.indexOf(to.path) !== -1){
                next()
            } else {
                next(`/?redirect=${to.path}`)
            }
        }
    } catch(error) {
        await store.dispatch('user/resetToken')
        Message.error(error || "网络错误")
        next(`/?redirect=${to.path}`)
    }
})

router.afterEach(() => {
    NProgress.done()
  })