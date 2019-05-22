export default {
  data() {
    return {
      rolesList: [],
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

      // console.log(res)
      const {
        data,
        meta
      } = res.data

      if (meta.status === 200) {
        let tableData = data
        this.rolesList = tableData.map(item => {
          return {
            roleDesc: item.roleDesc,
            id: item.id,
            roleName: item.roleName,
            childrens: item.children
          };
        });
      }
    }
  }
}
