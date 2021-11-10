import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import { Message } from 'element-ui'
//前面的$massage是自己命名的，后面的Massage是组件名字
Vue.prototype.$massage=Message
Vue.use(ElementUI)
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://180.76.111.200/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('data')
  return config
})
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    return next()
  }
  else if (!window.sessionStorage.getItem("token")) {
    Message.error('您还没有登录，请先登录')
    return next('/login')
  }
  next()
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

