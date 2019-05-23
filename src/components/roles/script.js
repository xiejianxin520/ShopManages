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
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    /**
     * 获取到所有的权限树形结构数据
     */

    /**
     * 获取角色列表数据
     */
    async getRolesList() {
      const res = await this.$http.get('/roles')
      console.log(res.data)
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
    delRoles(id) {
      this.$confirm('确认删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
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
    }
  }
}
