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
        <el-button type="success" plain @click="dialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <!-- scope.row 表示当前行的数据data里面的userlist的mg_state -->
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
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="showEditUser(scope.row)"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- //分页    layout 分页显示的内容 给 current-page 属性添加 .sync 修饰符后, 就可以设置当前页-->
    <el-pagination background layout="prev, pager, next" :total="total" :pageSize='pageSize' :current-page.sync="curPage" @current-change='currentChange'>
    </el-pagination>

    <!-- 添加用户对话框 :visible.sync="dialogFormVisible" 绑定是否打开对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="closeUserAdd">
      <el-form :model="userAddForm" :rules="userAddRules" ref="userAddForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input v-model="userAddForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="120px">
          <el-input v-model="userAddForm.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userAddForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userAddForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEditUser" @close="closeUserEdit">
      <el-form :model="userEditForm" :rules="userEditRules" ref="userEditForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input disabled v-model="userEditForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userEditForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userEditForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
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
      curPage: 1, // 当前页
      queryStr: '',
      //增加用户对话框
      dialogFormVisible: false, //默认增加用户弹框关闭
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userAddRules: {
        //添加用户规则
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },
      //编辑用户对话框
      dialogEditUser: false, //默认用户弹框关闭
      userEditForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      userEditRules: {
        //编辑用户规则
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            // 如果需要在值改变或者失去焦点的时候，都触发验证，可以传递两个
            // trigger: 'change, blur'
            // 当前值改变，就会触发
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户列表渲染页面
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
      this.$http.put(`/users/${id}/state/${curState}`).then(res => {
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
    },
    //添加用户确定按钮
    addUser() {
      this.$refs.userAddForm.validate(valid => {
        if (valid) {
          // console.log('验证成功', this.userAddForm)
          this.$http.post('/users', this.userAddForm).then(res => {
            console.log(res)
            const meta = res.data.meta
            if (meta.status === 201) {
              //添加用户成功后应该跳出对话框
              this.dialogFormVisible = false
              // this.closeUserAdd()//跳出对话框会自动执行清空命令
              // 2. 重新获取列表数据渲染页面
              this.getUserList()
              //成功信息
              this.$message({
                type: 'success',
                message: meta.msg,
                duration: 1000 //显示1秒
              })
            } else {
              this.$message({
                type: 'error',
                message: meta.msg,
                duration: 1000 //显示1秒
              })
            }
          })
        } else {
          console.log('验证失败')
          this.$message({
            type: 'error',
            message: '验证失败',
            duration: 1000 //显示1秒
          })
        }
      })
    },
    //关闭用户弹话框自动清空内容
    closeUserAdd() {
      this.$refs.userAddForm.resetFields()
    },
    //删除用户
    delUser(id) {
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then(res => {
            console.log(res)
            const meta = res.data.meta
            if (meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })

              // const index = this.userlist.findIndex(item => item.id === id)
              // this.userlist.splice(index, 1)
              // const totalPage = Math.round(this.userlist.length / 3)
              // if (totalPage === 0) {
              //   this.getUserList(--this.curPage)
              // }

              this.getUserList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //展示编辑用户对话框
    showEditUser(curUserdata) {
      console.log(curUserdata)
      //当前用户参数传进来
      this.dialogEditUser = true
      const { email, id, mobile } = curUserdata
      //循环遍历编辑用户对话框的userEditForm ，把当前用户信息赋值进去后展示
      for (const key in this.userEditForm) {
        this.userEditForm[key] = curUserdata[key]
      }
    },
    //编辑用户点确定按钮
    editUser() {
      this.$refs.userEditForm.validate(valid => {
        if (valid) {
          const { id, email, mobile } = this.userEditForm
          this.$http
            .put(`/users/${id}`, {
              email,
              mobile
            })
            .then(res => {
              console.log(res)
              const { data, meta } = res.data
              if (meta.status === 200) {
                // 更新该用户的数据
                const editUser = this.userlist.find(item => item.id === id)
                editUser.email = data.email
                editUser.mobile = data.mobile

                // 关闭对话
                this.dialogEditUser = false
              }
            })
          //成功信息
          this.$message({
            type: 'success',
            message: '编辑用户成功',
            duration: 1000 //显示1秒
          })
        } else {
          this.$message({
            type: 'error',
            message: '编辑用户失败',
            duration: 1000 //显示1秒
          })
        }
      })
    },
    closeUserEdit() {
      this.$refs.userEditForm.resetFields()
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
