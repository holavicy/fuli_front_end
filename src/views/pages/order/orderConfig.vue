<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>工号：</span> <el-input size="mini" placeholder="请输入内容" v-model="staffNo"></el-input></div>
            <div class="filter-item"><span>姓名：</span> <el-input size="mini" placeholder="请输入内容" v-model="staffName"></el-input></div>

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
            <el-button size="mini" type="primary" @click="getOrderList()">查询</el-button>
        </div>
    </template>

    <el-collapse accordion>
      <el-collapse-item v-for="(order, index) in orderList" :key="order.id">
        <template slot="title">
          <div class="title-wrapper">
            <div class="left">
                {{index+1}}、
                <span style="font-weight: bold">{{order.year}}——{{order.giftName}}</span>
                <span class="goods" v-for="(goods, i) in order.goods" :key = "i">{{goods.name}}</i></span>    
            </div>
            <div class="status">{{orderStatusDict[order.status]}}</div>
            <div class="right">
              <span style="display: inline-block;margin-left:20px" v-if="order.status == 1" @click.stop="confirmOrder(order)">确认</span>
              <span style="display: inline-block;margin-left:20px" v-if="order.status == 3" @click.stop="finishOrder(order)">确认收货</span>
            </div>
          </div>
        </template>
        <div class="goods-wrapper">
          <el-card v-for="goods in order.goods" :key="goods.id" :body-style="{ padding: '0px' }"  style="margin-right:10px;margin-bottom: 10px">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>{{goods.name}}</span>
            <p class="price-wrapper">
              <span>¥{{goods.price}}/{{goods.unit}}</span>
            </p>
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
export default {
    name: 'orderConfig',
    mixins: [
      js
    ],
    data(){
        return{
          staffNo: '',
          staffName: '',
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
      // 确认订单
      confirmOrder (order) {
        this.$confirm('确定通过此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(order)
          const data = {
            orderId: order.id,
            status: 3,
            staffNo: '100297'
          }
          this.$api.EDIT_ORDER_STATUS(data).then((res) => {
            this.$message.success('订单已确认')
            this.getOrderList()
            // 发送消息提醒员工可领取
            const userData = {
              userId: '100297'
            }
            this.$api.SEND_MESSAGE(userData).then(res => {
              console.log('发送成功')
              console.log(res)
            })
          })
        }).catch(() => {
          console.log('取消确认')
        });
      },

      //确认收货
      finishOrder(order){
        this.$confirm('确定确认收货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(order)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          console.log('取消确认收货')
        });
        
      },

      handleSizeChange (val) {
        this.pagination.pageSize = val
        this.getOrderList()
      },
      handleCurrentChange (val) {
        this.pagination.currentPage = val
        this.getOrderList()
      }
    },
    created(){
      this.getOrderList()
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

.title-wrapper{
  width: 20px;
  flex-grow: 1;
  display: flex;
  height: 100%;
  justify-content: space-between;
}
.title-wrapper .left{
  width: 600px;
  flex-grow: 0;
  flex-shrink: 0;
}
.title-wrapper .right{
  width: 200px;
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
