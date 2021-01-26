<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>领取年份：</span><el-date-picker size="mini" v-model="year" type="year" placeholder="请选择"></el-date-picker></div>
            <div class="filter-item"><span>领取状态：</span><el-select size="mini" v-model="orderStatus" placeholder="请选择">
                <el-option
                  v-for="item in orderStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-button size="mini" type="primary" @click="getOrderList(1)">查询</el-button>
        </div>
    </template>
    <el-collapse accordion>
      <el-collapse-item v-for="(order, index) in orderList" :key="order.id">
        <template slot="title">
          <div class="title-wrapper">
            <div class="left">
                {{index+1}}、
                <span style="font-weight: bold">{{order.year}}——{{order.giftName}}</span>
                <span class="goods" v-for="(goods, i) in order.goods" :key = "i">{{goods.name}}</span>
            </div>
            <div class="staff-name">{{order.staffName}}</div>
            <div class="status">{{orderStatusDict[order.status]}}</div>
            <div class="right">
              <span style="display: inline-block;margin-left:20px" v-if="order.status == 3" @click.stop="finishOrder(order)">确认领取</span>
            </div>
          </div>
        </template>
        <div class="goods-wrapper">
          <el-card v-for="goods in order.goods" :key="goods.id" :body-style="{ padding: '0px' }"  style="margin-right:10px;margin-bottom: 10px; width:235px">
          <img :src="'http://'+HOST_FILES+goods.imageUrl" class="image">
          <div style="padding: 14px;">
            <span>{{goods.name}}</span>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" style="margin-top:10px"></el-pagination>
  </d2-container>
</template>

<script>
import js from './mixins/index'
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
  name: 'othersOrderList',
  mixins: [
    js
  ],
  data () {
    return {
      dayjs,
      orderStatus: '',
      orderList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    ...mapActions('d2admin/db', [
      'database',
      'databaseClear'
    ]),
      
    async load () {
      const db = await this.database({ user: true })
      const userInfo = db.get('user_info').value()
      this.creator = userInfo.staffNo
      this.creatorName = userInfo.name
      this.userInfo = userInfo
      this.getOrderList()
    },
    // 获取订单信息
    getOrderList (page) {
      if (page) {
        this.pagination.currentPage = page
      }
      let data = {
        creator: this.creator,
        creatorName: this.creatorName,
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        year: this.year ? dayjs(this.year).year() : '',
        status: this.orderStatus
      }

      this.$api.GET_OTHERS_ORDER(data).then( res => {
        this.orderList = res.list
        console.log(this.orderList.length)
        this.pagination.total = res.count
      })
    }
  },
  created(){
    this.load()
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
.d2-container-full__footer{
  padding: 0;
}

.footer-wrapper{
    height: 80px;
  /* margin-top: 40px; */
  color: #303133;   
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background: rgb(242, 246, 252); */
  padding-left: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.info-item{
  line-height: 24px;
}
.info-item .title{
  display: inline-block;
  width: 120px;
}

.button-wrapper{
  display: flex;
}

.button-wrapper .btn{
  font-size: 18px;
  text-align: center;
  background: #409EFF;
  color: #ffffff;
  width: 160px;
  padding: 10px 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button-wrapper .btn.left:hover{
  cursor: pointer;
  background: rgb(102, 177, 255);
}
.button-wrapper .btn.right:hover{
  cursor: pointer;
  background:#a6a9ad;
}
.button-wrapper .btn.left{
  border-right: 1px solid #ffffff;
}
.button-wrapper .btn.right{
  background: #909399;
}
.goods-wrapper{
  display: flex;
  flex-wrap: wrap;
}

.goods-wrapper .image{
  width: 100%;
  height: 300px;
  display: block;
}

.title-wrapper{
  width: 20px;
  flex-grow: 1;
  display: flex;
  height: 100%;
}
.title-wrapper .left{
  width: 600px;
  flex-grow: 0;
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 20px;
}
.title-wrapper .staff-name{
  width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
}
.title-wrapper .status{
  width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
}
.title-wrapper .right{
  width: 100px;
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 10px;
  text-align: right;
}

.title-wrapper .left span.goods{
  margin-left: 20px;
  font-size: 12px;
  color: #909399;
}

.price-wrapper{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-wrapper .want-add{
  color: #F56C6C;
}
.price-wrapper .want-add:hover{
  cursor: pointer;
  color: red;
}
</style>
