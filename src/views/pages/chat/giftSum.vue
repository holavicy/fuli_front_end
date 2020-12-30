<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <!-- <div class="filter-item"><span>礼包名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="giftName"></el-input></div>
            <div class="filter-item"><span>年份：</span>
            <el-date-picker size="mini"
              v-model="year"
              type="year"
              placeholder="选择年"
              format="yyyy"
              value-format="yyyy">
            </el-date-picker>
            </div> -->
          <el-button size="mini" type="primary" @click="getReport(1)">刷新</el-button>
          <el-button size="mini" type="primary" plain @click="exportFile()">导出</el-button>
        </div>
    </template>
    <el-table :data="list" border style="width: 100%" size="mini" v-loading="loading" :span-method="objectSpanMethod">
        <el-table-column prop="index" label="序号" width="40"></el-table-column>
        <el-table-column prop="gift_name" label="礼包方案内容" width="120"></el-table-column>
        <el-table-column prop="gift_num" label="总共领取" width="80"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="80"></el-table-column>
        <el-table-column prop="goods_num" label="数量" width="60"></el-table-column>
        <el-table-column prop="goods_avg_price" label="出库均价" width="80"></el-table-column>
        <el-table-column prop="goods_total_amount" label="出库总价" width="60"></el-table-column>
        <el-table-column prop="all_amount" label="礼包商品出库总价合计" width="90"></el-table-column>
    </el-table>
    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" style="margin-top:10px"></el-pagination> -->

  </d2-container>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  name: 'giftSum',
  data () {
    return {
      dayjs,
      loading: false,
      list: [],
      userInfo: {},
      year: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      giftName: '',
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
    getReport () {
      this.loading = true
      const data = {
        // page: this.pagination.currentPage,
        // pageSize: this.pagination.pageSize,
        // giftName: this.giftName,
        // year: this.year
      }
      console.log(data)
      this.$api.GIFT_SUM_REPORT(data).then((res) => {
        this.loading = false
        this.list = this.formatList(res.list)
      })
    },

    formatList (oriData) {
        let resData = []
        oriData.forEach((ele, i) => {
          if (ele.goods_list.length > 0) {
            ele.goods_list.forEach((goods, index) => {
              let goodsItem = goods
              goodsItem.gift_id = ele.gift_id
              goodsItem.gift_name = ele.gift_name
              goodsItem.gift_num = ele.gift_num
              goodsItem.index = i + 1
              goodsItem.all_amount = ele.all_amount
              if (index === 0) {
                goodsItem.rowspan = true
                goodsItem.rowNum = ele.goods_list.length
              }
              resData.push(goodsItem)
            })
          }
        })
      return resData
    },

    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.getReport(1)
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
      this.getReport()
    },

    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
      if (columnIndex <=2 || columnIndex >= 7) {
        if (row.rowspan) {
          return {
            rowspan: row.rowNum,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },

    exportFile () {
      const data = {}
      
      this.$api.EXPORT_GIFT_SUM(data).then((res) => {
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
