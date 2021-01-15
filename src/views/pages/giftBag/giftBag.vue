<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>礼包名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="giftBagName"></el-input></div>
            <div class="filter-item"><span>商品名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="goodsName"></el-input></div>
            <el-button size="mini" type="primary" @click="getGifts(1)">查询</el-button>
        </div>
    </template>
    <el-table :data="giftBagList" :span-method="objectSpanMethod" border height="390" size="mini">
      <el-table-column label="礼包名称">
        <template slot-scope="scope">
          <el-radio v-model="selectedGiftBagIndex" :label="scope.row.index">
            {{scope.row.index}}、{{scope.row.giftBagName}}
            <el-image style="width: 160px; height: 60px; margin-top: 20px; display: block" :src="'http://'+HOST_FILES+scope.row.image_url" @click.stop="previewImage(scope.row.image_url)"></el-image>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          <el-checkbox v-model="checked" :label="scope.row" v-if="scope.row.giftBagLimitNum>0 && scope.row.is_must == 0" :disabled="scope.row.num == 0 || scope.row.disabled" @change="checkedChanged"><span>{{scope.row.name}}</span><i class="cus-badge" v-if="scope.row.is_must == 1">必选</i></el-checkbox>
          <div v-else class="goods-name-wrapper">
            <img :src="`${$baseUrl}image/common/check-box.png`" class="check-box" v-if="scope.row.is_must == 1">
            <span>{{scope.row.name}}</span>
            <i class="cus-badge" v-if="scope.row.is_must == 1">必选</i>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="imageUrl" label="图片" width="120">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 60px" :src="'http://'+HOST_FILES+scope.row.imageUrl" @click.stop="previewImage(scope.row.imageUrl)"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="140">
        <template slot-scope="scope">
          <div class="stock-wrapper">
            <span :class="{'no-num':scope.row.num<=0}">{{ scope.row.num>0?scope.row.num + "（" + scope.row.unit +"）":"暂无库存" }}</span>
            <el-tooltip class="item" effect="dark" content="该商品库存为空，若您想要，点我" placement="top">
              <i class="fa fa-heart want-add" aria-hidden="true" v-if="scope.row.num <= 0 && scope.row.totalLikeNum == 0" @click="want(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="取消想要" placement="top">
              <img :src="`${$baseUrl}image/common/cancel-like.png`" class="cancel-like" v-if="scope.row.num <= 0 && scope.row.totalLikeNum > 0" @click="cancelWant(scope.row.id)">
            </el-tooltip>
          </div>
          
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" style="margin-top:10px"></el-pagination>
      <el-divider content-position="left" style="font-size:18px">订单详情</el-divider>
      <div class="tip-info-wrapper">
        <img :src="`${$baseUrl}image/common/warning.png`">
        <span>生日福利包含一张餐券和一份生日礼包，领取生日礼包的时候，管理员会同时发放一张餐券，确认领取礼包的时候请确认餐券与礼包是否都已领取！</span>
      </div>
      <div class="footer-wrapper">
        <div class="order-info">
          <div class="info-item"><span class="title">生日礼包领取人：</span><span>{{staffName}}</span><span v-if="canSupply" type="text" class="btn-primary" style="margin-left: 20px" @click="chooseStaff()">代他人领取</span></div>
          <div class="info-item"><span class="title">领取年份：</span><span>{{this.year}}</span></div>
          <div class="info-item"><span class="title">领取礼包名称：</span><span>{{selectedGiftBag.name}}</span></div>
        </div>
        <div class="button-wrapper">
          <div class="btn right" @click="createOrder()">确定领取<br>此生日礼包</div>
        </div>
      </div>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>确定申请后将无法修改生日礼包，您确定申请此礼包？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="createOrderRes()">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="imgDialogVisible" width="30%">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- 选择代领人 -->
    <el-dialog title="选择人员" :visible.sync="dialogFormVisible">
      <el-radio-group v-model="supplyStaffIndex">
        <el-radio :label="i" v-for="(item, i) in supplyStaffList" :key="i">{{item.staff_name}}</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setSupplyStaff()">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
import * as dd from 'dingtalk-jsapi'
export default {
  name: 'giftBag',
  data () {
    return {
      dialogImageUrl: '',
      supplyStaffIndex: 0,
      dialogVisible: false,
      dialogFormVisible: false,
      today: new Date(),
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
      staffNo: '',
      creator: '',
      staffName: '',
      creatorName: '',
      canSupply: false,
      imgDialogVisible: false,
      supplyStaffList: [],
      userInfo: null
    }
  },
  computed: {
    year: function () {
      return this.today.getFullYear()
    },

    thisYearBirthday: function () {
      return this.userInfo.birthday ? this.userInfo.birthday.replace(/^[0-9]{4}/g, this.year) : ''
    },

    isZBirthday: function () {
      const oriYear = this.userInfo.birthday ? /^[0-9]{4}/g.exec(this.userInfo.birthday)[0] : 0
      const isZBirthday = (Number(this.year) - Number(oriYear) + 1) % 10 === 0 ? true : false
      return isZBirthday
    },

    selectedGiftBag: function () {
      return String(this.selectedGiftBagIndex) ? this.giftBagOriList[this.selectedGiftBagIndex-1] : {}
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
            goodsItem.image_url = ele.image_url
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
    // 礼包中选择商品
    checkedChanged (value) {
      console.log('checked')
      console.log(this.checked)

      const length = this.checked.length
      // 选中商品默认选中该商品所属于的礼包
      this.selectedGiftBagIndex = Number(this.checked[length-1].index)
      console.log(this.selectedGiftBagIndex)
      // 将this.check中不属于同一个礼包的数据移除
      if (length >= 2 && this.checked[length-1].giftBagId != this.checked[0].giftBagId) {
        this.checked = this.checked.slice(-1)
      }
      // 在根据limitNum控制当前礼包哪些商品不可选
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
    // 创建订单
    createOrder () {
      // 判断是否可以领取礼包
      if (!(this.userInfo.userStatus != 2 && ((this.thisYearBirthday >= this.userInfo.hiredate && this.today >= this.thisYearBirthday) || this.userInfo.JOBRANKCODE <= 4))) {
        this.$message.error('暂不满足申请礼包的条件')
        return
      }
      // 判断是否选择了礼包
      if (!this.selectedGiftBag.id) {
        this.$message.error('请先选择礼包')
        return
      }
      // 判断几选几的礼包是否选满
      if (this.selectedGiftBag.limitGoodsNum > 0) {
        console.log(this.checked.length)
        console.log(this.selectedGiftBag.limitGoodsNum)
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
      this.dialogVisible = true
    },
    // 创建订单接口
    createOrderRes () {
      this.dialogVisible = false
      // 判断是否领取了礼包
      let data = this.selectedGiftBag
      const goodsList = [...data.goods]
      let mustChooseGoods = null
      goodsList.forEach(goods => {
        if (goods.is_must == 1) {
          mustChooseGoods = goods
          return
        }
      })
      if (this.selectedGiftBag.limitGoodsNum > 0) {
        data.goods = this.checked
      }
      // 判断所选礼包是否包含必选商品，若包含，则将必选商品头部插入data.goods中
      if (mustChooseGoods) {
        data.goods.unshift(mustChooseGoods)
      }
      // 领取礼包的人
      data.staffNo = this.staffNo
      data.staffName = this.staffName
      // 创建礼包的人
      data.creator = this.creator
      data.creatorName = this.creatorName
      data.year = this.year
      console.log(data)
      this.$api.CREATE_ORDER(data).then( res => {
        this.$message.success('生日礼包申领成功，等待管理员确认中')
        this.$router.push('/orderList')
        if (this.staffNo == this.creator) {
          this.$router.push('/orderList')
        } else {
          this.$router.push('/othersOrderList')
        }
      })
    },
    // 获取所有上架礼包
    getGifts (page) {
      this.selectedGiftBagIndex = ''
      if (page) {
        this.pagination.currentPage = page
      }
      const data = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        giftName: this.giftBagName,
        goodsName: this.goodsName,
        giftStatus: 1,
        staffNo: this.creator
      }

      this.$api.GET_GIFTS(data).then(res => {
        this.pagination.total = res.count
        this.giftBagOriList = [...res.list]
        this.giftBagList = this.formatGiftBagData(this.giftBagOriList)
        console.log(this.giftBagList)
      })
    },

    // 选择申请人
    chooseStaff () {
      // 选人弹框出现
      this.dialogFormVisible = true
    },

    // 设置申请人
    setSupplyStaff () {
      this.dialogFormVisible = false
      this.staffNo = this.supplyStaffList[this.supplyStaffIndex].staff_no
      this.staffName = this.supplyStaffList[this.supplyStaffIndex].staff_name
    },
    ...mapActions('d2admin/db', [
      'database',
      'databaseClear'
    ]),
    async load () {
      const db = await this.database({ user: true })
      const userInfo = db.get('user_info').value()
      this.userInfo = userInfo
      this.staffNo = userInfo.staffNo
      this.creator = userInfo.staffNo
      this.staffName = userInfo.name
      this.creatorName = userInfo.name
      this.getGifts()
      this.getSupplyList()
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.getGifts()
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
      this.getGifts()
    },
    want (id) {
      const data = {
        goodsId: id,
        staffNo: this.creator,
        creatorName: this.creatorName
      }
      this.$api.LIKE(data).then((res) => {
        this.$message.success('操作成功')
        this.getGifts()
      })
    },

    cancelWant (goodsId) {
      const data = {
        goodsId: goodsId,
        staffNo: this.creator
      }
      this.$api.CANCEL_WANT(data).then(res => {
        this.$message.success('取消成功')
        this.getGifts()
      })
    },
    getSupplyList () {
      const data = {
        page: '',
        pageSize: '',
        year: this.year,
        supplyStaffNo: this.creator
      }
      this.$api.GET_SUPPLY(data).then(res => {
        let supplyStaffList = []
        res.list.forEach((record, index) => {
          if (record.supply_order_list.length == 0) {
            supplyStaffList.push(record)
          }
        })
        this.canSupply = supplyStaffList && supplyStaffList.length > 0
        this.supplyStaffList = supplyStaffList
      })
    },

    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
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

    // 预览图片
    previewImage (imageUrl) {
      this.imgDialogVisible = true
      this.dialogImageUrl = 'http://' + this.HOST_FILES + imageUrl
    }
  },
  created () {
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
}
.button-wrapper .btn.left{
  border-right: 1px solid #ffffff;
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

.goods-wrapper .goods-name{
  height: 42px;
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

.want-add{
  color: #F56C6C;
  margin-left: 20px;
}
.want-add:hover{
  cursor: pointer;
  color: red;
}

.btn-primary{
  background-color: #409EFF;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
}
.btn-primary:hover{
  cursor: pointer;
  background:#017EFF;
}
.no-num{
  color: #f56c6c;
  font-weight: bold;
}
.cus-badge{
  font-size: 10px;
  line-height: 12px;
  background: red;
  color: #ffffff;
  border-radius: 5px;
  padding: 0 4px;
  font-style: normal;
  margin-left: 6px;
}
.goods-name-wrapper{
  display: flex;
  align-items: center;
}

.goods-name-wrapper .check-box{
  width: 14px;
  height: 14px;
  display: block;
  margin-right: 10px;
}

.tip-info-wrapper{
  font-size: 14px;
  background:rgb(236, 245, 255);
  padding: 10px;
  display: flex;
  align-items: center;
}

.tip-info-wrapper img{
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
.stock-wrapper{
  display: flex;
  align-items: center;
}
.cancel-like{
  width: 12px;
  height: 12px;
  display: block;
  margin-left: 20px;
}
.cancel-like:hover{
  cursor: pointer;
}
</style>
