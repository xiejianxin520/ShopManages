// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
// 导入全局样式
import '@/assets/index.css'
import axios from 'axios'
// 引入moment
import moment from 'moment'

Vue.use(ElementUI)
// 将 axios 添加到Vue的原型中
Vue.prototype.$http = axios
// 配置公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
//请求拦截器
axios.interceptors.request.use(function (config) {
  // 在请求发送之前做一些事情
  // console.log('请求拦截器', config)
  // 判断如果不是登录接口,就需要添加 Authorization 请求头
  if (!config.url.endsWith('/login')) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }

  return config
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log('相应拦截器', response)
  //响应拦截器有返回的数据，这时候我们可以判断token 是否正确，如果不正确返回登陆界面
  if (response.data.meta.status === 401) {
    router.path('/login')
    localStorage.removeItem('token')
  }
  return response
})

//全局定义事件过滤器
Vue.filter('dataFileter', (input, format = "YYYY-MM-DD  HH:mm:ss") => {
  return moment(input * 1000).format(format)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
