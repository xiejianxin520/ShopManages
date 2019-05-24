<template>
  <!-- // label-position="top" 设置label的位置
        // :model 用来给表单设置数据模型（对象）
        // :rules 用来设置表单验证规则的
        // ref 用来引用当前的表单组件
        // :rules 用来设置表单验证规则的
        // ref 用来引用当前的表单组件
        prop 它的值是 model 对象中的一个属性,与model相对应
          当使用 表单验证 或者 表单重置 功能时，必须要提供该属性
           -->

  <el-row type="flex" class="row-bg" justify="center" align='middle'>
    <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4" class="login-content">
      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      //添加用户规则
      // required 是否为必填项
      // message 当前规则校验失败时的提示
      // trigger 表单验证的触发实际，blur表示失去焦点时触发
      rules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 登录功能的实现
    // login() {
    //   axios.post('http://localhost:8888/api/private/v1/login', this.ruleForm).then(res => {
    //     console.log(res.data)
    //     const data = res.data.data
    //     const meta = res.data.meta
    //     if (meta.status === 200) {
    //       // alert('登录成功')
    //       // 将登录成功的标识（token）存储到localStorage中
    //       localStorage.setItem('token', data.token)
    //       this.$router.push('/home')
    //     } else {
    //       // alert(meta.msg)
    //       this.$message({
    //         type: 'error',
    //         message: meta.msg,
    //         duration: 1000 //显示1秒
    //       })
    //     }
    //   })
    // },

    //用async和await封装
    async login() {
      const res = await axios.post('http://localhost:8888/api/private/v1/login', this.ruleForm)
      console.log(res.data)
      const data = res.data.data
      const meta = res.data.meta
      if (meta.status === 200) {
        // alert('登录成功')
        // 将登录成功的标识（token）存储到localStorage中
        localStorage.setItem('token', data.token)
        this.$router.push('/home')
      } else {
        // alert(meta.msg)
        this.$message({
          type: 'error',
          message: meta.msg,
          duration: 1000 //显示1秒
        })
      }
    },

    //创建
    // ref 用在组件中，就表示当前组件
    // this.$refs.loginForm
    // valid 表示是否校验成功，如果成功就为：true
    // 如果失败就为：false
    submitForm(b) {
      // this.$refs.loginForm
      this.$refs[b].validate(valid => {
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  components: {}
}
</script>

<style scope>
.row-bg {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
}
.login-content {
  min-width: 300px;
  padding: 20px 35px;
  border-radius: 10px;
  background-color: #fff;
}
</style>

