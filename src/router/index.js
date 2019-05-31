import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import User from '@/components/user/User'
import Rights from '@/components/RolesRights/rights/Rights'
import Roles from '@/components/RolesRights/roles/Roles'
import Categories from '@/components/ShopGoods/categories/Categories'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/',
    redirect: '/login'
  }, {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [{
      path: 'users',
      name: 'users',
      component: User
    }, {
      path: 'rights',
      name: 'Rights',
      component: Rights
    }, {
      path: 'roles',
      name: 'Roles',
      component: Roles
    }, {
      path: 'categories',
      name: 'Categories',
      component: Categories
    }, ]
  }]
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else { // 通过登录成功时候保存的token，来作为有没有登录成功的条件
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router;


// - 说明：在没有登录的情况不应该让用户来访问除登录以外的任何页面

// ### 登录和拦截的整个流程说明

// - 1 在登录成功以后，将 token 存储到 localStorage 中
// - 2 在 导航守卫 中先判断当前访问的页面是不是登录页面
// - 3 如果是登录页面，直接放行（next()）
// - 4 如果不是登录页面，就从 localStorage 中获取 token，判断有没有登录
// - 5 如果登录了，直接放行（next()）
// - 6 如果没有登录，就跳转到登录页面让用户登录（next('/login')）
