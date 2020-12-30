<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
          <el-button size="mini" type="primary" @click="getReport()">刷新</el-button>
          <el-button size="mini" type="primary" plain @click="exportFile()">导出</el-button>
        </div>
    </template>
    <el-table :data="goodsList" border style="width: 100%" size="mini" v-loading="loading">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id" label="商品ID" width="100"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="allIn" label="总入库数量" width="100"></el-table-column>
        <el-table-column prop="allOut" label="总出库数量" width="100"></el-table-column>
        <el-table-column prop="stock" label="库存数量" width="100"></el-table-column>
        <el-table-column prop="price" label="均价" width="100"></el-table-column>
        <el-table-column prop="totalInAmount" label="总价（总入库数量*均价）" width="200"></el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'goods',
  data () {
    return {
      loading: false,
      goodsList: [],
      userInfo: {}
    }
  },

  methods: {
    ...mapActions('d2admin/db', [
      'database',
      'databaseClear'
    ]),
    async load () {
      const db = await this.database({ user: true })
      this.userInfo = db.get('user_info').value()
      console.log(this.userInfo)
    },

    // 获取商品列表
    getReport (page) {
      this.loading = true
      this.$api.GOODS_STOCK_REPORT({}).then((res) => {
        this.loading = false
        this.goodsList = res.list
      })
    },

    exportFile () {
      this.$api.EXPORT_CHART_GOODS({}).then((res) => {
        const href = 'http://' + this.HOST_FILES + res.url
        window.location.href = href
        this.$message.success('导出成功')
      }).catch(e => {
        this.$message.error('导出失败')
      })
    },
  },

  created () {
    this.load()
    this.getReport()
  }
}
</script>

<style scoped>
.action-wrapper{
    display: flex;
    font-size: 12px;
}

.action-wrapper .filter-item{
    width: 260px;
    display: flex;
    align-items: center;
    margin-right: 20px;
}

.action-wrapper .filter-item span{
    width: 60px;
    flex-shrink: 0;
}

.margin-right-20{
    margin-right: 20px;
}

.cus-badge{
  font-size: 10px;
  line-height: 12px;
  background: red;
  color: #ffffff;
  border-radius: 5px;
  padding: 0 4px;
  font-style: normal;
}
</style>
