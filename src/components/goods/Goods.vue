<template>
  <div>
    <el-table :data="goodsList" v-loading="loading" element-loading-text="请稍等，正在拼命加载中" element-loading-spinner="el-icon-loading" stripe style="width: 100%">
      <!-- tree-key: 指定每一个节点的key标示，只有指定了才能，嵌套解析 -->
      <!-- level-key: 指定当前层级 -->
      <!--  parent-key: 如果不指定，没办法缩起来 -->
      <!-- indent-size:指定缩进 -->
      <!-- child-key: 通过哪个属性去查找子节点 children -->
      <el-table-tree-column prop="cat_name" label="分类名称" tree-key="cat_id" level-key="cat_level" parent-key="cat_pid" child-key="children" :indent-size="20">
      </el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否删除">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? "是":"否"}}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0 "> 一级 </span>
          <span v-else-if="scope.row.cat_level === 1 "> 二级 </span>
          <span v-else> 三级 </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
// 导入elelemnt-tree-grid插件包
var ElTreeGrid = require('element-tree-grid')
// Vue.component('el-table-tree-column', ElTreeGrid)变为局部组件
export default {
  name: 'Goods',
  data() {
    return {
      goodsList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true //加载弹框
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //获取数据
    async getGoodsList() {
      const res = await this.$http.get('/categories', {
        params: {
          type: 3, //三层列表
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      console.log(res.data)
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.goodsList = data.result
        this.total = data.total
        //获取数据后，取消加载弹框
        setTimeout(() => {
          this.loading = false
        }, 800)
      }
    },
    // 修改了每页的条数
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getGoodsList()
    },
    // 修改了当前页的页码
    handleCurrentChange(val) {
      this.loading = true
      this.current = val
      this.getGoodsList()
    }
  },
  components: {
    // 把ElTreeGrid注册为局部的组件
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style scope>
</style>
