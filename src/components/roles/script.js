export default {
  data() {
    return {
      rolesList: [],
      // 修改对话框的展示和隐藏
      dialogFormRoles: false,
      curRolesform: {
        id: -1,
        roleName: '',
        roleDesc: ''
      },
      // 修改分配权限对话框的展示和隐藏
      dialogFormRights: false,
      //所有权限的树形数据
      rightsTree: [],
      defaultProps: {
        // children 用来指定使用哪个属性来指定子节点
        children: 'children',
        // label 用来指定使用数据中的哪个属性展示树形控制中每个节点的名字
        label: 'authName'
      }
    }
  },
  created() {
    this.getRolesList()
    this.getRightsTree()
  },
  methods: {
    /**
     * 获取角色列表数据
     */
    async getRolesList() {
      const res = await this.$http.get('/roles')
      console.log('角色列表', res.data)
      const {
        data,
        meta
      } = res.data
      if (meta.status === 200) {
        let tableData = data
        //最新elemui树形结构Childrens会造成错误，所以要map修改childrens
        this.rolesList = tableData.map(item => {
          return {
            roleDesc: item.roleDesc,
            id: item.id,
            roleName: item.roleName,
            childrens: item.children
          };
        });
      }
    },
    /**
     * 删除角色信息
     */
    async delRoles(id) {
      try {
        // 等待用户点击确定或取消按钮
        await this.$confirm('确认删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log('点击确定删除')

        // 如果点击是确定按钮，就会执行以下代码：
        // 发送请求，删除当前角色
        const res = await this.$http.delete(`/roles/${id}`)
        // console.log(res.data);
        if (res.data.meta.status === 200) {
          const curindex = this.rolesList.findIndex(item => item.id === id)
          this.rolesList.splice(curindex, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      } catch (err) {
        // 如果点击的取消按钮，就会执行以下代码：
        // 相当于处理 Promise 的catch()
        console.log('点击取消')

        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      }
    },
    // delRoles(id) {
    //   this.$confirm('确认删除该角色, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(async () => {
    //     const res = await this.$http.delete(`/roles/${id}`)
    //     // console.log(res.data);
    //     if (res.data.meta.status === 200) {
    //       const curindex = this.rolesList.findIndex(item => item.id === id)
    //       this.rolesList.splice(curindex, 1)
    //     }
    //     this.$message({
    //       type: 'success',
    //       message: '删除成功!'
    //     });
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     });
    //   });
    // },
    /**
     * 编辑修改角色信息
     */
    showEditRoles(curRoles) {
      this.dialogFormRoles = true
      // this.curRolesform.roleName = curRoles.roleName
      // this.curRolesform.roleDesc = curRoles.roleDesc
      // this.curRolesform.id = curRoles.id

      for (const key in this.curRolesform) {
        this.curRolesform[key] = curRoles[key]
      }
    },
    /**
     * 点击确定编辑修改角色信息
     */
    async editRoles() {
      const {
        id,
        roleName,
        roleDesc
      } = this.curRolesform;
      const res = await this.$http.put(`/roles/${id}`, {
        roleName,
        roleDesc
      })
      // console.log(res.data);
      const {
        data,
        meta
      } = res.data
      if (meta.status === 200) {
        // console.log('sss');
        const curEditRoles = this.rolesList.find(item => item.id === id)
        curEditRoles.roleName = data.roleName
        curEditRoles.roleDesc = data.roleDesc
      }
      this.dialogFormRoles = false
    },
    /**
     * 首先页面加载先获取所有树形数据
     */
    async getRightsTree() {
      const res = await this.$http.get('/rights/tree')
      console.log('权限列表', res.data);

      const {data,meta} = res.data
      if(meta.status === 200){
        this.rightsTree = data
        // console.log(this.rightsTree);
      }
    },
    /**
     * 点击展示修改权限
     */
    showRights() {
      this.dialogFormRights = true

    }
  }
}
