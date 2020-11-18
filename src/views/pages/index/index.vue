<template>
  <d2-container>
    <template slot="header">
      <div class="user-info">
        <div class="left">
          <img style="width: 100px; height: 100px" :src="userInfo.avatar"/>
          <div>
            <p class="name">{{userInfo.name}}</p>
            <p>{{userInfo.staffNo}}</p>
          </div>
        </div>
        <div class="right">
          <div class="line-item"><span class="label">出生日期：</span><span class="value">{{userInfo.birthday}}</span></div>
          <div class="line-item"><span class="label">员工状态：</span><span class="value">{{userInfo.userStatus == 1 ? '全职' : '试用期员工'}}</span></div>
        </div>
      </div>
    </template>
    <div class="gift-bag-info">
      <div v-if="userInfo.userStatus == 2" class="wrapper">
        <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
        <div class="desc">
          <div class="weight-info">暂无生日礼包可领取</div>
          <div class="light-info">您正处于试用期，转正之后才可以享受生日礼包福利哦~</div>
        </div>
      </div>
      <div v-else>
        <div v-if="thisYearBirthday >= userInfo.hiredate">
          <div v-if="isZBirthday" class="wrapper">
            <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
            <div class="desc">
              <div class="weight-info">您有一个生日礼包可以领取</div>
              <div class="light-info">您有一个生日礼包可通过OA申请，快去领取吧~</div>
            </div>
          </div>
          <div v-else>
            <div v-if="orderList.length == 0" class="wrapper">
              <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
              <div class="desc">
                <div class="weight-info">您有一个生日礼包可以领取</div>
                <div class="light-info">HAPPY BIRTHDAY~您今年的生日礼包福利可以申请啦，快去领取吧~</div>
                <el-button type="primary" class="btn-cus" round  @click="toGifts()">即刻申请</el-button>
              </div>
            </div>
            <div v-else class="wrapper">
              <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
              <div class="desc">
                <div class="weight-info">您今年的生日礼包福利已申请</div>
                <div class="light-info" v-if="orderList[0].status == 1">您的生日礼包申请正在审核中，请耐心等待……</div>
                <div class="light-info" v-if="orderList[0].status == 3">您的生日礼包申请已审核通过，现在可以联系福利管理员前往领取生日礼包啦~</div>
                <el-button type="primary" round class="btn-cus" v-if="orderList[0].status == 3" @click="finishOrder()">确认领取</el-button>
                <el-button type="primary" round class="btn-cus" v-if="orderList[0].status == 4" @click="toOrders()">查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="wrapper">
          <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
          <div class="desc">
            <div class="weight-info">暂无生日礼包可领取</div>
            <div class="light-info">您今年的生日小于转正日期，无法申请生日礼包，明年即可申请啦~</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>您确定已领取今年的生日礼包？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishOrderRes()">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      userInfo: {},
      today: new Date(),
      orderList: [],
      dialogVisible: false
    }
  },

  computed: {
    year: function () {
      return this.today.getFullYear()
    },

    thisYearBirthday: function () {
      return this.userInfo.birthday ? this.userInfo.birthday.replace(/^[0-9]{4}/g,this.year) : ''
    },

    isZBirthday: function () {
      console.log('jisua')
      console.log(this.userInfo.birthday)
      console.log(/^[0-9]{4}/g.exec(this.userInfo.birthday))
      const oriYear = this.userInfo.birthday ? /^[0-9]{4}/g.exec(this.userInfo.birthday)[0] : 0
      
      const isZBirthday = (Number(this.year) - Number(oriYear)) % 10 === 0 ? true : false
      return isZBirthday
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
      this.getOrder()
    },
    // 获取订单
    getOrder () {
      let data = {
        year: this.year,
        staffNo: this.userInfo.staffNo,
        page: 1,
        status: '',
        pageSize: 10
      }
      this.$api.GET_LIST(data).then(res => {
        this.orderList = res.list
      })
    },
    // 申请福利
    toGifts () {
      this.$router.push('/giftBag')
    },
    // 确认领取生日礼包
    finishOrder () {
      this.dialogVisible = true
    },

    finishOrderRes () {
      const data = {
        orderId: this.orderList[0].id,
        status: 4,
        staffNo: this.userInfo.staffNo
      }
      this.dialogVisible = false
      this.$api.EDIT_ORDER_STATUS(data).then(res => {
        this.$message.success('确认领取成功')
        this.getOrder()
      })
    },

    // 前往查看订单详情
    toOrders () {
      this.$router.push('/orderList')
    }
  },

  created () {
    this.load()
  }
}
</script>


<style lang="scss">
  .user-info{
    font-size: 14px;
    font-family: 'Microsoft Yahei';
    color: #222222;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .left{
      display: flex;
      align-items: center;
      justify-self: start;

      img{
        margin-right: 40px;
      }
      p{
        line-height: 28px;
        margin: 0;
        &.name{
          font-size: 24px;
          line-height: 48px;
          color: #222222;
        }
      }
    }
  }

  .gift-bag-info{
    margin-top: 40px;
    .wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;
      .gift-image {
          width: 128px;
          height: 128px;
          display: block;
          margin-bottom: 20px;
      }
      .desc{
        text-align: center;
        color: #888888;
        .weight-info{
          font-size: 20px;
          margin-bottom: 10px;
          color: #222222;
        }
        .btn-cus{
          margin-top: 40px;
        }

      }
    }
  } 
</style>