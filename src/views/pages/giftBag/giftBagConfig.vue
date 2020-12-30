<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>礼包名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="giftBagName"></el-input></div>
            <div class="filter-item"><span>商品名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="goodsName"></el-input></div>
            <div class="filter-item">
                <span>礼包状态： </span>
                <el-select size="mini" v-model="giftBagStatus" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <el-button size="mini" type="primary" @click="getGifts(1)">查询</el-button>
            <el-button size="mini" type="danger" plain @click="addGoods()">新增礼包</el-button>
        </div>
    </template>
    <el-table :data="giftBagList" :span-method="objectSpanMethod" border style="width: 100%" height="390" size="mini">
        <el-table-column prop="index" width="40"></el-table-column>
        <el-table-column label="礼包名称" width="180">
          <template slot-scope="scope">
            <div class="gift-name-wrapper"></div>
            <p>{{scope.row.giftBagName}}</p>
            <el-image style="width: 160px; height: 60px; margin: 0 auto" :src="'http://'+HOST_FILES+scope.row.image_url" @click.stop="previewImage(scope.row.image_url)"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" width="180">
           <template slot-scope="scope">
            {{scope.row.name}}
            <i class="cus-badge" v-if="scope.row.is_must == 1">必选</i>
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="图片" width="180">
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 60px" :src="'http://'+HOST_FILES+scope.row.imageUrl" @click.stop="previewImage(scope.row.imageUrl)"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100">
          <template slot-scope="scope">
            <span :class="{'no-num':scope.row.num<=0}">{{ scope.row.num>0?scope.row.num + "（" + scope.row.unit +"）":"暂无库存" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价/元" width="100"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.giftBagStatus" active-text="已上架" inactive-text="已下架" size="mini" style="margin-right:20px" :active-value="1" :inactive-value="3" @change="onOffTrigger(scope.row)"></el-switch>
                <el-popconfirm title="确定删除此礼包？" @onConfirm="handleDelete(scope.$index, scope.row)">
                    <el-link slot="reference" type="danger" class="margin-right-20">删除</el-link>
                </el-popconfirm>
                <el-link type="primary" @click="editGoods(scope.$index, scope.row)" >编辑</el-link>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" style="margin-top:10px"></el-pagination>

    <!-- 新增、编辑弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="66%">
        <el-form :model="newGiftBag">
            <el-form-item label="礼包名称" :label-width="formLabelWidth">
              <el-input v-model="newGiftBag.name" autocomplete="off" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="礼包图片" :label-width="formLabelWidth">
              <el-upload
                class="avatar-uploader"
                action="default"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="importFile" >
                  <img v-if="newGiftBag.image_url" :src="'http://'+HOST_FILES+newGiftBag.image_url" class="avatar cus-image">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="单品限制" :label-width="formLabelWidth">
              <el-input-number v-model="newGiftBag.limitGoodsNum" :min="0" :max="20" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="必选商品" :label-width="formLabelWidth">
              <el-select v-model="mustChooseGoodsIndex" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in goodsOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择商品" :label-width="formLabelWidth">
              <el-transfer filterable :filter-method="filterMethod" :titles="['商品列表', '已选商品']"
                filter-placeholder="请输入商品名称"
                v-model="selectedGoodsList"
                :data="transferData" @change="setSelectedGoods">
              </el-transfer>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitNewGoods()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="imgDialogVisible" width="30%">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'giftBagConfig',
  data () {
    return {
      imgDialogVisible: false,
      dialogImageUrl: '',
      file: null,
      mustChooseGoodsIndex: '',
      mustChooseGoods: null,
      dialogTitle: '新增礼包',
      dialogFormVisible: false,
      giftBagName: '',
      goodsName: '',
      giftBagStatus: '',
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      options: [{
        label: '全部',
        value: ''
      }, {
        label: '上架',
        value: 1
      }, {
        label: '下架',
        value: 3
      }],
      formLabelWidth: '120px',
      giftBagList: [],
      giftBagOriList: [],
      newGiftBag: {
        name: '',
        image_url: '',
        limitGoodsNum: 0,
        goods: []
      },
      userInfo: {},
      formattedGoodsData: [],
      transferData: [],
      goodsOptions: [],
      selectedGoodsList: [],
      filterMethod (query, item) {
        return item.label.indexOf(query) > -1
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
      this.userInfo = db.get('user_info').value()
    },
    beforeUpload (file) {
      this.file = file
    },
    importFile () {
      let fileData = new FormData()
      fileData.append('file', this.file)
      fileData.append('staffNo', this.userInfo.staffNo)
      const url = '/uploadImage'
      this.uploadFile(url, fileData).then((res) => {
        if (res.data.code === 0) {
          this.newGiftBag.image_url = res.data.data
          console.log(this.newGiftBag)
        } else {
          console.log(res)
        }
      }, (rej) => {
        console.log(rej)
      })
    },
    // 删除商品
    handleDelete (index, row) {
      console.log(row)
      const data = {
        id: row.giftBagId,
        status: 2,
        staffNo: this.userInfo.staffNo
      }
      this.$api.UPDATE_GIFTBAG_STATUS(data).then((res) => {
        this.$message({
          type: 'success',
          message: '礼包删除成功' 
        })
        this.getGifts()
      })
    },
    // 新增礼包
    addGoods () {
      this.dialogTitle = '新增礼包'
      this.dialogFormVisible = true
      this.selectedGoodsList = []
      this.newGiftBag = {
        name: '',
        image_url: '',
        limitGoodsNum: 0,
        goods: []
      }
      this.getOnSaleGoods()
    },
    // 编辑礼包
    editGoods (index, row) {
      this.dialogTitle = '编辑礼包'
      this.getOnSaleGoods().then((res) => {
        this.dialogFormVisible = true
        this.newGiftBag = this.giftBagOriList[row.index - 1]
        console.log('this.newGiftBag')
        console.log(this.newGiftBag)
        this.selectedGoodsList = []
        let mustGoodsIndex = ''
        console.log(this.newGiftBag.goods)
        this.newGiftBag.goods.forEach((goods, goodsIndex) => {
          console.log(goods)
          this.goodsData.forEach((g, i) => {
            if (goods.is_must == 1 && goods.id === g.id) {
              console.log(i)
              mustGoodsIndex = goodsIndex
              this.mustChooseGoodsIndex = i
            }
            if (goods.id === g.id && goods.is_must == 0) {
              this.selectedGoodsList.push(i)
            }
          })
        })

        if (mustGoodsIndex != '') {
          this.newGiftBag.goods.splice(mustGoodsIndex, 1)
        }
      })
    },
    // 提交礼包数据
    submitNewGoods () {
      if (this.mustChooseGoods) {
        this.mustChooseGoods['is_must'] = 1
        this.newGiftBag.goods.unshift(this.mustChooseGoods)
      }
      let data = this.newGiftBag
      if (!data.name) {
        this.$message.error('请输入礼包名称')
        return
      }

      if (data.goods.length === 0) {
        this.$message.error('请选择礼包中的商品')
        return
      }

      if (this.mustChooseGoods && data.limitGoodsNum == 0) {
        this.$message.error('请输入单品限制')
        return
      }

      if (this.mustChooseGoods && data.limitGoodsNum >= data.goods.length - 1) {
        this.$message.error('单品限制必须小于商品的个数')
        return
      }

      if (!this.mustChooseGoods && data.limitGoodsNum >= data.goods.length) {
        this.$message.error('单品限制必须小于商品的个数')
        return
      }

      this.dialogFormVisible = false
      data.staffNo = this.userInfo.staffNo
      if (this.newGiftBag.id) {
        console.log('编辑')
        this.$api.EDIT_GIFT_BAG(data).then(res => {
          console.log(res)
          this.$message.success('修改礼包成功！')
          this.getGifts()
        })
      } else {
        this.$api.ADD_GIFT_BAG(data).then(res => {
          console.log(res)
          this.$message.success('新增礼包成功！')
          this.getGifts(1)
        })
      }
    },
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
            goodsItem.giftBagStatus = ele.status
            goodsItem.goodsLength = ele.goods.length
            goodsItem.limitGoodsNum = ele.limitGoodsNum
            goodsItem.index = i + 1
            if (index === 0) {
              goodsItem.rowspan = true
              goodsItem.rowNum = ele.goods.length
            }
            resData.push(goodsItem)
          })
        } else {
          let goodsItem = {}
          goodsItem.giftBagId = ele.id
          goodsItem.giftBagName = ele.name
          goodsItem.giftBagStatus = ele.status
          goodsItem.index = i + 1
          goodsItem.rowspan = true
          goodsItem.rowNum = 1
          resData.push(goodsItem)
        }
      })
      console.log('格式化结束')
      console.log(resData)
      return resData
    },
    // 格式化穿梭框数据
    formatTransferData (data) {
      let list = []
      data.forEach((goods, index) => {
        let item = {}
        item.label = goods.name
        item.key = index
        list.push(item)
      })
      return list
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 6) {
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
    // 当穿梭框变化时，重置礼包中选中的商品
    setSelectedGoods (value) {
      console.log('transfer changed')
      console.log(value)
      this.newGiftBag.goods = []
      value.forEach(i => {
        this.goodsData[i]['is_must'] = 0
        this.newGiftBag.goods.push(this.goodsData[i])
      })
    },
    // 获取所有的上架商品
    getOnSaleGoods () {
      const data = {
        goodsStatus: 1
      }

      return new Promise((reslove, reject) => {
        this.$api.GET_ALL_GOODS(data).then(res => {
          this.goodsData = res.list
          this.formattedGoodsData = this.formatTransferData(this.goodsData)
          this.transferData = [...this.formattedGoodsData]
          this.goodsOptions = [...this.formattedGoodsData]
          reslove(res)
        })
      })
      
    },
    // 获取礼包
    getGifts (page) {
      if (page) {
        this.pagination.currentPage = page
      }
      const data = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        giftName: this.giftBagName,
        goodsName: this.goodsName,
        giftStatus: this.giftBagStatus
      }

      this.$api.GET_GIFTS(data).then(res => {
        console.log(res)
        this.pagination.total = res.count
        this.giftBagOriList = [...res.list]
        this.giftBagList = this.formatGiftBagData(this.giftBagOriList)
        console.log(this.giftBagList)
      })
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.getGifts()
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
      this.getGifts()
    },
    // 礼包上下架
    onOffTrigger (giftBag) {
      console.log(giftBag)
      const data = {
        id: giftBag.giftBagId,
        status: giftBag.giftBagStatus,
        staffNo: this.userInfo.staffNo
      }
      this.$api.UPDATE_GIFTBAG_STATUS(data).then((res) => {
        this.$message({
          type: 'success',
          message: '礼包' + (giftBag.giftBagStatus === 1 ? '上架' : giftBag.giftBagStatus === 3 ? '下架' : '') + '成功!'
        })
        this.getGifts()
      })
    },

    // 预览图片
    previewImage (imageUrl) {
      this.imgDialogVisible = true
      this.dialogImageUrl = 'http://' + this.HOST_FILES + imageUrl
    }
  },
  watch: {
    // 当选择了必选商品后，可选商品列表自动去掉必选商品, 若选择的商品已被选到了穿梭框的右边，也要更新穿梭框右边的值
    mustChooseGoodsIndex (val) {
      console.log('watch')
      console.log(val)
      console.log(typeof(val))
      console.log(val != '')
      if (typeof(val) === 'number' && val >= 0) {
        this.mustChooseGoods = this.goodsData[val]
        let ori = [...this.formattedGoodsData]
        ori.splice(val, 1)
        this.transferData = ori
        this.newGiftBag.goods = []
        let selectedGoodsList = []
        this.selectedGoodsList.forEach(i => {
          if (i != val) {
            this.goodsData[i]['is_must'] = 0
            this.newGiftBag.goods.push(this.goodsData[i])
            selectedGoodsList.push(i)
          }
          
        })
        this.selectedGoodsList = selectedGoodsList
      } else {
        this.mustChooseGoodsId = ''
        this.mustChooseGoods = null,
        this.transferData = [...this.formattedGoodsData]
      }
    }
  },
  created () {
    this.load()
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
.no-num{
  color: #f56c6c;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
