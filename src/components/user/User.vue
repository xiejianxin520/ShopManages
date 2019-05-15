<template>
  <!--
      el-table 表格组件
        data 用来给表格组件提供数据
        stripe 添加改属性后，启用隔行变色效果

      el-table-column 表格中的每一列
        label 每一列的标题名称
        prop 表示数据中的属性名（字段名称）
     -->
  <div>
    <el-table :data="userlist" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
      </el-table-column>
      <el-table-column prop="address" label="操作">
      </el-table-column>
    </el-table>
    <!-- //分页    layout 分页显示的内容 给 current-page 属性添加 .sync 修饰符后, 就可以设置当前页-->
    <el-pagination background layout="prev, pager, next" :total="total" :pageSize='pageSize' :current-page="curPage" @current-change='currentChange'>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      userlist: [],
      pageSize: 3, // 每页条数
      total: 10, // 总条数
      curPage: 3 // 当前页码
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList(curPage = 1) {
      this.$http
        .get('/users', {
          params: {
            pagenum: curPage, // 当前页
            pagesize: 3 // 每页展示多少条数据
          }
          // headers: { Authorization: localStorage.getItem('token') } // 将 token 作为请求头，传递给服务器接口这样，才能正确的调用这个接口
        })
        .then(res => {
          console.log('USER返回页码数据', res) //里面有包含总页数
          // const { data, meta } = res.data
          const data = res.data.data
          const meta = res.data.meta
          if (meta.status === 200) {
            this.userlist = data.users
            this.total = data.total
          }
        })
    },
    //------跳转到想要分页数据.*********
    currentChange(a) {
      // 就把当前页数参数传进去获取
      // console.log(a)
      this.getUserList(a)
    }
  },
  components: {}
}
</script>

<style>
</style>
