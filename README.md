## 项目功能

- 1 登录(将登录成功的标识（token）存储到localStorage中)
- 2 首页
- 2.1 封装axios
- 3 退出(清除token)
- 4 用户管理
  - 4.1 列表展示
  - 4.2 分页
  - 4.3 查询
  - 4.4 启用/禁用用户
  - 4.5 添加用户
  - 4.6 编辑用户
  - 4.7 删除用户
- 5 权限管理


## 在项目中使用 element-ui



## 1 登录功能
1.利用element-ui中的表单验证功能验证是否符合登陆规则
2.使用 axios 根据接口文档来发送请求，完成登录
2.this.$router.push('/home')
3.将登录成功的标识（token）存储到localStorage中

## 1.2 登录拦截
- 说明：在没有登录的情况不应该让用户来访问除登录以外的任何页面
### 登录和拦截的整个流程说明

- 1 在登录成功以后，将 token 存储到 localStorage 中
- 2 在 导航守卫 中先判断当前访问的页面是不是登录页面
- 3 如果是登录页面，直接放行（next()）
- 4 如果不是登录页面，就从 localStorage 中获取 token，判断有没有登录
- 5 如果登录了，直接放行（next()）
- 6 如果没有登录，就跳转到登录页面让用户登录（next('/login')）





## 2 home主页功能
1.利用element-ui设置容器布局，侧边栏的菜单列表
2.退出功能,清除localStorage的token,跳回登陆页面
## 3. 封装axios
- 3.1  将 axios 添加到Vue的原型中
        Vue.prototype.$http = axios
- 3.2   配置公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
- 3.3   请求拦截器
- 判断如果不是登录接口,就需要添加 Authorization 请求头
 - 响应拦截器有返回的数据，这时候我们可以判断token 是否正确，如果不正确返回登陆界面


 


## 用户管理
1.利用element-ui设置表格和布局
## 2.分页功能
## 3.启用或禁用用户