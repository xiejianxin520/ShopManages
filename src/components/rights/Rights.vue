<template>
  <div>
    <!-- 图标面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="rights-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightsList" style="width: 100%">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column prop="level" label="层级">
        <!-- 自定义按钮或者自定义内容要加<template slot-scope="scope"> -->
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsData()
  },
  methods: {
    async getRightsData() {
      const res = await this.$http.get('/rights/list')
      console.log(res.data)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rightsList = data
      }
    }
  },
  components: {}
}
</script>

<style scope>
.rights-breadcrumb {
  line-height: 40px;
  background-color: #d4dae0;
  font-size: 18px;
  padding-left: 10px;
}
</style>
