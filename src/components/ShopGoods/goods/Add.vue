<template>
  <div>
    <el-steps :active="active" finish-status="success" simple class="stepsty">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- 标签页。 v-model绑定可修改跳转到想要的标签-->
    <el-tabs v-model="activeName" tab-position="left" @tab-click='change'>
      <el-tab-pane name="basic" 　label="基本信息">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :options="options" :props="props" change-on-select v-model="form.goods_cat" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="form.is_promote" label="1">是</el-radio>
            <el-radio v-model="form.is_promote" label="2">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextone(2,'pic')">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 商品图片 -->
      <el-tab-pane name="pic" label="商品图片">
        <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :headers="headers" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" class="nextbtn" @click="nextone(3,'content')">下一步</el-button>
      </el-tab-pane>
      <!-- //商品内容 -->
      <el-tab-pane name="content" label="商品内容">
        <quill-editor class="myEditor" v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" class="sumBtn" @click="addGood">提交</el-button>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      active: 1,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        // 用于接收上传成功的图片的信息
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      activeName: 'basic',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created() {
    this.getOptionsData()
  },
  methods: {
    change(tab) {
      // console.log(tab.index)
      this.active = +tab.index
      // console.log(this.active)
    },
    //获取商品分类数据
    async getOptionsData() {
      const res = await this.$http.get('/categories?type=3')
      // console.log(res.data)
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    //下一页
    nextone(active, activename) {
      this.active = active
      this.activeName = activename
    },
    //文件上传成功时添加到后台需要参数pics
    handleSuccess(response) {
      // console.log(response.data.tmp_path);
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },
    //文件移除
    handleRemove(file, fileList) {
      console.log(file.response.data.tmp_path)
      let removePic = file.response.data.tmp_path
      let removeindex = this.form.pics.findIndex(item => {
        item.pic === removePic
      })
      this.form.pics.splice(removeindex, 1)
    },
    //提交所有添加的数据
    async addGood() {
      // console.log(...this.form, this.form.goods_cat.join())

      const res = await this.$http.post('/goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      // console.log(res.data)
      const {
        meta: { status, msg },
        data
      } = res.data
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('添加商品成功')
        this.$message.error(msg)
      }
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.stepsty {
  margin-bottom: 30px;
}
.nextbtn {
  margin-top: 20px;
}
.myEditor {
  background-color: #fff;
  /deep/  .ql-editor {
    height: 300px;
  }
}
.sumBtn {
  margin-top: 20px;
}
</style>
