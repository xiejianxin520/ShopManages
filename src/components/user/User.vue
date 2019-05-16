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
    <!-- 图标面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <!-- gutter间隔。运用span弹性布局原理可以弄在同一行 -->
    <el-row :gutter="20" class="seacher">
      <el-col :span='6'>
        <el-input placeholder="请输入内容" v-model="queryStr" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click='queryData'></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain>成功按钮</el-button>
      </el-col>
    </el-row>

    <el-table :data="userlist" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="150">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="120">
      </el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <!-- scope.row 表示当前行的数据data里面的userlist的mg_state -->
          <el-switch v-model="scope.row.mg_state" @change='switchChange(scope.row.id,scope.row.mg_state)'> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- //分页    layout 分页显示的内容 给 current-page 属性添加 .sync 修饰符后, 就可以设置当前页-->
    <el-pagination background layout="prev, pager, next" :total="total" :pageSize='pageSize' :current-page.sync="curPage" @current-change='currentChange'>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      userlist: [],
      //绑定属性默认都要写的
      pageSize: 3, // 每页条数
      total: 10, // 总条数
      curPage: 2, // 当前页
      queryStr: ''
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
            pagesize: 3, // 每页展示多少条数据
            query: this.queryStr || ''
          }
          // headers: { Authorization: localStorage.getItem('token') } // 将 token 作为请求头，传递给服务器接口这样，才能正确的调用这个接口
        })
        .then(res => {
          console.log('USER返回数据', res) //里面有包含总页数
          // const { data, meta } = res.data
          const data = res.data.data
          const meta = res.data.meta
          if (meta.status === 200) {
            this.userlist = data.users
            this.total = data.total
            this.curPage = data.pagenum
          }
        })
    },
    //------跳转到想要分页数据.*********
    currentChange(a) {
      //a就是当前页
      // 就把当前页数参数传进去获取
      // console.log(a)
      this.getUserList(a)
    },
    //搜索框功能
    queryData() {
      // console.log(this.queryStr)
      this.getUserList()
    },
    //开关禁用客户
    switchChange(id, curState) {
      // console.log(b)
      this.$http.put(`/users/${ssss}/state/${curState}`).then(res => {
        console.log('开关禁用客户', res)
        const { data, meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: data.mg_state === 0 ? '禁用成功' : '激活成功',
            type: 'success',
            duration: 1000
          })
        } else {
          this.$message({
            message: meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      })
    }
  },
  components: {}
}
</script>

<style scope>
.user-breadcrumb {
  line-height: 40px;
  background-color: #d4dae0;
  font-size: 18px;
  padding-left: 10px;
}
.seacher {
  margin: 10px 0 10px;
}
</style>
