<template>
  <d2-container>
    <template slot="header">
      <div class="user-info">
        <div class="left">
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

    <!-- 礼包状态信息 -->
    <div class="gift-bag-info">
      <!-- 试用期员工不可以领取礼包 -->
      <div v-if="userInfo.userStatus == 2" class="wrapper">
        <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
        <div class="desc">
          <div class="weight-info">暂无生日礼包可领取</div>
          <div class="light-info">您正处于试用期，转正之后才可以享受生日礼包福利哦~</div>
        </div>
      </div>
      <!-- 正式员工可以领取礼包 -->
      <div v-else>

        <!-- 在生日之前转正可领取，或职级《=4 可领取 -->
        <div v-if="thisYearBirthday >= userInfo.hiredate || userInfo.JOBRANKCODE <= 4">
        <!-- {{new Date(thisYearBirthday)}}
          {{today>=new Date(thisYearBirthday)}} -->
          <!-- 若到了生日这一天显示可领取 -->
          <div v-if="today>=new Date(thisYearBirthday) || userInfo.JOBRANKCODE <= 4">
            <div v-if="isZBirthday" class="wrapper">
              <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
              <div class="desc">
                <div class="weight-info">您有一个生日礼包可以领取</div>
                <div class="light-info">您有一个整生日福利可通过OA申请，快去领取吧~</div>
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
              <div class="light-info">小主别急，您的生日还没到哦，请于{{thisYearBirthday}}之后再来吧~</div>
            </div>
          </div>
        </div>

        <!-- 在生日之后转正不可领取 -->
        <div v-else class="wrapper">
          <img :src="`${$baseUrl}image/common/gift.png`" class="gift-image">
          <div class="desc">
            <div class="weight-info">暂无生日礼包可领取</div>
            <div class="light-info">您今年的生日小于转正日期，无法申请生日礼包，明年即可申请啦~</div>
          </div>
        </div>

      </div>

    </div>

    <!-- 当前登录人的代领列表 -->
    <el-card class="other-supply-wrapper" v-if="supplyList.length>0">
      <div slot="header" class="clearfix">
        <span>您可以帮以下同事代领生日礼包：</span>
      </div>
       <el-table :data="supplyList" style="width: 100%" size="mini">
        <el-table-column prop="staff_name" label="姓名" width="180"></el-table-column>
        <el-table-column label="礼包状态" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.supply_order_list.length == 0">未申请</span>
            <span v-else>{{orderStatusDict[scope.row.supply_order_list[0].status]}}</span></template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-link type="primary" v-if="scope.row.supply_order_list.length == 0" @click="toGifts()">立即申请</el-link>
            <el-link type="primary" v-else @click="toOrder()">查看订单详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 意见收集卡片 -->
    <el-card class="suggest-wrapper" v-if="canSuggest">
      <div slot="header" class="clearfix">
        <span>为了提供更好的生日福利，诚邀您参与礼包意见收集，我们会根据您的建议，逐步优化生日礼包，谢谢您的参与！<i class="tip">注：最多选择3个选项</i></span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="submitSuggest()">提交意见</el-button>
      </div>
      <el-checkbox-group v-model="checkedSuggests" :min="1" :max="3" class="cus-check-group" @change="checkChange()">
        <el-checkbox class="cus-checkbox" v-for="suggestItem in suggestDict" :label="suggestItem.id" :key="suggestItem.id">{{suggestItem.name}}</el-checkbox>
      </el-checkbox-group>
      <el-input v-if="showInput" class="cus-input" v-model="otherSuggest" placeholder="请输入内容" size="mini"></el-input>
    </el-card>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
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
      dialogVisible: false,
      checkedSuggests: [],
      suggestDict: [],
      otherSuggest: '',
      showInput: false,
      supplyList: [],
      orderStatusDict: {
        1: '待管理员确认',
        2: '已取消',
        3: '待领取',
        4: '已领取'
      },
      canSuggest: false
    }
  },

  computed: {
    year: function () {
      return this.today.getFullYear()
    },

    thisYearBirthday: function () {
      return this.userInfo.birthday ? this.get7DaysBefore(this.userInfo.birthday.replace(/^[0-9]{4}/g, this.year)) : ''
    },

    isZBirthday: function () {
      const oriYear = this.userInfo.birthday ? /^[0-9]{4}/g.exec(this.userInfo.birthday)[0] : 0
      const isZBirthday = (Number(this.year) - Number(oriYear) + 1) % 10 === 0 ? true : false
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
      this.getOrder()
      this.getSupplyList()
      this.hasSuggested()
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
        let list = res.list
        let validList = []
        if (list && list.length > 0) {
          list.forEach(item => {
            if (item.status != 2) {
              validList.push(item)
            }
          })
        }
        this.orderList = validList
      })
    },
    // 申请福利
    toGifts () {
      this.$router.push('/giftBag')
    },
    // 去代领订单列表页
    toOrder () {
      this.$router.push('/othersOrderList')
    },
    // 确认领取生日礼包
    finishOrder () {
      this.dialogVisible = true
    },
    finishOrderRes () {
      const data = {
        orderId: this.orderList[0].id,
        status: 4,
        staffNo: this.userInfo.staffNo,
        staffName: this.userInfo.name
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
    },
    // 获取所有的建议选项
    getSuggestDict () {
      this.$api.GET_SUGGEST_DICT({}).then(res => {
        this.suggestDict = res.list
      })
    },
    checkChange () {
      let flag = false
      this.checkedSuggests.forEach(item => {
        console.log(item)
        if (item == 9) {
          flag = true
          return
        }
      })
      this.showInput = flag
    },
    submitSuggest () {
      if (this.checkedSuggests.length === 0) {
        this.$message.error('请至少选择一个意见')
        return
      }

      if (this.showInput && !this.otherSuggest) {
        this.$message.error('请输入其他建议')
        return
      }

      const data = {
        staffNo: this.userInfo.staffNo,
        staffName: this.userInfo.name,
        suggestIds: this.checkedSuggests.join(','),
        text: this.otherSuggest
      }

      this.$api.CREATE_SUGGEST(data).then(res => {
        this.$message.success('提交成功')
        this.checkedSuggests = []
        this.otherSuggest = ''
        this.showInput = false
        this.hasSuggested()
      })
    },
    // 获取当前员工的代领列表
    getSupplyList () {
      const data = {
        page: '',
        pageSize: '',
        staffNo: '',
        year: this.year,
        supplyStaffNo: this.userInfo.staffNo
      }
      this.$api.GET_SUPPLY(data).then( res => {
        console.log(res)
        this.supplyList = res.list
      })
    },
    // 判断当前登录人今年是否已经提交过意见
    hasSuggested () {
      const data = {
        staffNo: this.userInfo.staffNo
      }
      this.$api.GET_SUGGEST_RECORDS(data).then((res) => {
        console.log(res)
        this.canSuggest = !(res.list && res.list.length > 0)
      })
    }
  },

  created () {
    this.load()
    this.getSuggestDict()
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
    height:100px;

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
    margin-top: 30px;
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

  .suggest-wrapper{
    font-size: 14px;
    margin-top: 60px;
    padding-bottom: 40px;
    .title{
      border-left: 2px solid #409EFF;
      line-height: 24px;
      padding-left: 12px;
      margin-bottom: 10px;
    }
    .tip{
      margin-left: 12px;
      font-size: 12px;
      color: #888;
      margin-bottom: 20px;
      font-style: normal;
    }
    .cus-check-group{
      display: flex;
      flex-direction: column;
      margin-left: 12px;

      .cus-checkbox{
        margin-top: 10px;
      }
    }

    .cus-input{
      margin-left: 32px;
      width: 200px;
      margin-top: 10px;
    }
  }

  .other-supply-wrapper {
    margin-top: 40px;
  }

</style>