<template>
  <div>
    <el-button type="success" plain @click="$router.push('/goods-add')" class="btnsty">添加商品</el-button>
    <el-table :data="goodsList" stripe style="width: 100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.add_time | dataFileter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[10,20,30,40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data() {
    return {
      goodsList: [],
      query: '',
      current: 1,
      pagesize: 10,
      total: 10
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    //获取所有商品数据
    async getGoodList() {
      const res = await this.$http.get('/goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      // console.log(res.data)
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      }
    },
    //条数改变
    handleSizeChange(val) {
      this.pagesize = val
      this.current = 1
      this.getGoodList()
    },
    //当前页改名
    handleCurrentChange(val) {
      this.current = val
      this.getGoodList()
    },
    indexMethod(index) {
      return index + 1 + (this.current - 1) * this.pagesize
    }
  },
  components: {}
}
</script>

<style scope>
.btnsty {
  margin: 3px 0 15px;
}
</style>

