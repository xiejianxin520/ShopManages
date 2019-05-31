<template>
  <div>
    <el-button type="success" plain class="btnsty" @click="showAddGoods">添加分类</el-button>
    <!-- 商品列表 -->
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
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delCategory(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogGoods">
      <el-form ref="goodsfrom" :rules="rules" :model="goodsfrom" status-icon>
        <!-- prop要验证字段 -->
        <el-form-item label="分类名称" prop="cat_name" label-width="120px">
          <el-input v-model="goodsfrom.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 选择即改变次级选择器:prop='props' -->
        <el-form-item label="父级名称" label-width="120px" prop="cat_pid">
          <el-cascader :options="options" change-on-select :props="props" v-model="goodsfrom.cat_pid" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGoods = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入elelemnt-tree-grid插件包
var ElTreeGrid = require('element-tree-grid')
// Vue.component('el-table-tree-column', ElTreeGrid)变为局部组件
export default {
  name: 'Categories',
  data() {
    return {
      goodsList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true, //加载弹框
      dialogGoods: false, //增加分类对话框,
      goodsfrom: {
        cat_name: '',
        cat_pid: []
      },
      // 次级选择器
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 验证规则
      rules: {
        cat_name: [{ required: true, message: '请输入分类的名称', trigger: 'change' }]
      }
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
      // console.log(res.data)
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
        }, 500)
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
    },
    //添加分类展开对话框
    async showAddGoods() {
      this.dialogGoods = true
      // 发送axios请求，获取分类的属性（1级和2级）
      const res = await this.$http.get('/categories?type=2')

      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
        // console.log(this.options)
      }
    },
    //确定添加分类
    submitForm() {
      this.$refs.goodsfrom.validate(async valid => {
        if (!valid) {
          return false
        }

        const { cat_name: catName, cat_pid: catPid, cat_level } = this.goodsfrom
        const res = await this.$http.post('/Categories', {
          cat_name: catName,
          cat_pid: catPid[catPid.length - 1] || 0, // 如果是一级分类，pid为0
          cat_level: catPid.length
        })

        console.log(res.data)

        const {
          meta: { status, msg },
          data
        } = res.data
        if (status === 201) {
          this.$message.success('添加商品分类成功')
          this.$refs.goodsfrom.resetFields() //重置
          this.dialogGoods = false
          this.total++
          this.current = Math.ceil(this.total / this.pageSize)
          this.getGoodsList()
        } else {
          this.$messgae.error(msg)
        }
      })
    },
    //删除商品
    async delCategory(row) {
      await this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      let res = await this.$http.delete(`categories/${row.cat_id}`)
      console.log(res.data)
      const {
        meta: { status, msg }
      } = res.data
      if (status === 200) {
        this.$message.success('删除分类成功了')
        if (this.goodsList.length === 1 && this.current > 1) {
          this.current--
        }
        this.getGoodsList()
      } else {
        this.$message.error(msg)
      }
    }
  },
  components: {
    // 把ElTreeGrid注册为局部的组件
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style scope>
.btnsty {
  margin: 3px 0 15px;
}
</style>
