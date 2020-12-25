<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>商品名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="goodsName"></el-input></div>
            <div class="filter-item"><span>入库日期：</span>
            <el-date-picker size="mini"
              v-model="value1"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            </div>
          <el-button size="mini" type="primary" @click="getReport(1)">刷新</el-button>
          <el-button size="mini" type="primary" plain>导出</el-button>
        </div>
    </template>
    <el-table :data="list" border style="width: 100%" size="mini" v-loading="loading">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id" label="商品ID" width="100"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column label="入库日期" width="180">
          <template slot-scope="scope">
            {{dayjs(scope.row.create_time).subtract(8, 'hour').format('YYYY-M-D HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="入库数量" width="100"></el-table-column>
        <el-table-column prop="price" label="当前入库单价" width="100"></el-table-column>
        <el-table-column prop="amount" label="当前入库总价" width="100"></el-table-column>
        <el-table-column prop="change_des" label="入库说明" width="200"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" style="margin-top:10px"></el-pagination>

  </d2-container>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  name: 'goodsStockIn',
  data () {
    return {
      dayjs,
      loading: false,
      list: [],
      userInfo: {},
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      goodsName: '',
      value1: []
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
      if (page) {
        this.pagination.currentPage = page
      }
      console.log(this.value1)
      const data = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        goodsName: this.goodsName,
        beginDate: this.value1[0] ? dayjs(this.value1[0]).format('YYYY-M-D') : '',
        endDate: this.value1[1] ? dayjs(this.value1[1]).format('YYYY-M-D') : ''
      }
      console.log(data)
      this.$api.GOODS_STOCK_IN_DETAIL_REPORT(data).then((res) => {
        this.loading = false
        this.list = res.list
        this.pagination.total = res.count
      })
    },

    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.getReport(1)
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
      this.getReport()
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
