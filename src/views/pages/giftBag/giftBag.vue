<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>礼包名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="giftBagName"></el-input></div>
            <div class="filter-item"><span>商品名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="goodsName"></el-input></div>
            <el-button size="mini" type="primary">查询</el-button>
        </div>
    </template>

    <el-collapse accordion>
      <el-collapse-item v-for="(giftBag, index) in giftBagOriList" :key="giftBag.id">
        <template slot="title">
          <div class="title-wrapper">
            <div class="left">
              <el-radio v-model="selectedGiftBagIndex" :label="index" @change="giftBagIndexChanged">
                {{index+1}}、
                <span style="font-weight: bold">{{giftBag.name}}</span>
                </el-radio>
                <span class="goods" v-for="(goods, i) in giftBag.goods" :key = "i">{{goods.name}}</span>
            </div>
            <div class="right">
              <span style="display: inline-block;margin-left:20px">{{giftBag.limitGoodsNum>0?giftBag.goods.length+'选'+giftBag.limitGoodsNum:'共计'+giftBag.goods.length+'商品'}}</span>
            </div>
          </div>
        </template>
        <div class="goods-wrapper">
          <el-card v-for="goods in giftBag.goods" :key="goods.id" :body-style="{ padding: '0px' }"  style="margin-right:10px;margin-bottom: 10px">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <el-checkbox v-model="checked" :label="goods" v-if="giftBag.limitGoodsNum>0" :disabled="goods.num == 0 || goods.disabled" @change="checkedChanged"><span>{{goods.name}}</span></el-checkbox>
            <span v-else>{{goods.name}}</span>
            <p class="price-wrapper">
              <span>¥{{goods.price}}/{{goods.unit}}</span>
                <el-tooltip class="item" effect="dark" content="该商品库存为空，若喜欢，点我通知管理员补货啦~" placement="right-start">
                <i class="fa fa-heart want-add" aria-hidden="true" v-if="goods.num<=0"></i>
                </el-tooltip>
            </p>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
      <el-divider content-position="left" style="font-size:18px">订单详情</el-divider>
      <div class="footer-wrapper">
        <div class="order-info">
          <div class="info-item"><span class="title">生日礼包领取人：</span><span>陈明姣</span><span type="text" style="margin-left: 20px">代他人领取</span></div>
          <div class="info-item"><span class="title">领取年份：</span><span>2020</span></div>
          <div class="info-item"><span class="title">领取礼包名称：</span><span>{{selectedGiftBag.name}}</span></div>
        </div>
        <div class="button-wrapper">
          <!-- <div class="btn left" @click="showDrawer">查看生日<br>礼包详情</div> -->
          <div class="btn right" @click="createOrder">确定领取<br>此生日礼包</div>
        </div>
      </div>
  </d2-container>
</template>

<script>
export default {
  name: 'giftBag',
  data () {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      giftBagOriList: [],
      checked: [],
      selectedGiftBagIndex: '',
      drawer: false,
      giftBagName: '',
      goodsName: '',
      giftBagList: [],
      selectedGiftBag: {}
    }
  },
  methods: {
    // 格式化表格数据
    formatGiftBagData (oriData) {
      let resData = []
      oriData.forEach((ele, i) => {
        if (ele.goods.length > 0) {
          ele.goods.forEach((goods, index) => {
            let goodsItem = goods
            goodsItem.giftBagId = ele.id
            goodsItem.giftBagName = ele.name
            goodsItem.index = i + 1
            goodsItem.giftBagLimitNum = ele.limitGoodsNum
            if (index === 0) {
              goodsItem.rowspan = true
              goodsItem.rowNum = ele.goods.length
            }
            resData.push(goodsItem)
          })
        }
      })
      return resData
    },
    // 查看订单详情
    showDrawer () {
      if (!this.selectedGiftBag.id) {
        this.$message.error('请先选择礼包')
        return
      } else {
        this.drawer = true
        console.log(this.selectedGiftBag.goods)
      }
    },
    // 礼包中选择商品
    checkedChanged (value) {
      if (this.checked.length > 0 && this.checked.length >= this.checked[0].giftBagLimitNum) {
        let index = this.checked[0].index - 1
        this.giftBagOriList[index].goods.forEach(oriGoods => {
          let flag = false
          oriGoods.disabled = true
          this.checked.forEach(selectedGoods => {
            if (oriGoods.id === selectedGoods.id) {
              oriGoods.disabled = false
            }
          })
        })
      } else {
        if (this.checked.length > 0) {
          let index = this.checked[0].index - 1
          this.giftBagOriList[index].goods.forEach(oriGoods => {
            oriGoods.disabled = false
          })
        }
      }
    },
    // 选择礼包
    giftBagIndexChanged () {
      this.selectedGiftBag = this.giftBagOriList[this.selectedGiftBagIndex]
      this.checked = []
    },
    handleClose () {
      this.drawer = false
    },
    // 创建订单
    createOrder () {
      // 判断是否选择了礼包
      if (!this.selectedGiftBag.id) {
        this.$message.error('请先选择礼包')
        return
      }
      // 判断几选几的礼包是否选满
      if (this.selectedGiftBag.limitGoodsNum > 0) {
        if (this.checked.length < this.selectedGiftBag.limitGoodsNum) {
          this.$message.error('礼包需选满' + this.selectedGiftBag.limitGoodsNum + '个商品，您还差' + (this.selectedGiftBag.limitGoodsNum - this.checked.length) + '个商品，请选择')
          return
        }
      } else {
        // 判断选择的礼包是否包含库存为0的商品
        let flag = true
        this.selectedGiftBag.goods.forEach(g => {
          if (g.num <= 0) {
            this.$message.error('您选择的礼包中“' + g.name + '”暂时缺货，请选择其他礼包')
            flag = false
            return
          }
        })
        if (!flag) {
          return
        }
      }
      // 判断是否领取了礼包
      let data = this.selectedGiftBag

      if (this.selectedGiftBag.limitGoodsNum > 0) {
        data.goods = this.checked
      }

      // 领取礼包的人
      data.staffNo = '100297' 
      // 创建礼包的人
      data.creator = '100297'
      data.year = '2020'
      console.log(data)
      console.log('调用创建订单接口')

      this.$api.CREATE_ORDER(data).then( res => {
        this.$message.success('生日礼包申领成功，等待管理员确认中')
      })
    },
    // 获取所有上架礼包
    getGifts () {
      const data = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        giftName: this.giftBagName,
        goodsName: this.goodsName,
        giftStatus: 1
      }

      this.$api.GET_GIFTS(data).then(res => {
        console.log(res)
        this.pagination.total = res.count
        this.giftBagOriList = [...res.list]
        this.giftBagList = this.formatGiftBagData(this.giftBagOriList)
      })
    },
  },
  created () {
    this.getGifts()
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
.title-wrapper .right{
  margin-right: 10px;
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
