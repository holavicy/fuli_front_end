<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>商品名称：</span> <el-input size="mini" placeholder="请输入内容" v-model="goodsName"></el-input></div>
            <div class="filter-item">
                <span>商品状态： </span>
                <el-select size="mini" v-model="goodsStatus" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <el-button size="mini" type="primary" @click="getAllGoods()">查询</el-button>
            <el-button size="mini" type="primary" plain>增量导入</el-button>
            <el-button size="mini" type="danger" plain @click="addGoods">新增</el-button>
        </div>
    </template>
    <el-table :data="goodsList" border style="width: 100%" size="mini">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="名称" width="180"></el-table-column>
        <el-table-column prop="image_url" label="图片" width="180">
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 60px" :src="scope.row.image_url"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="库存" width="100"></el-table-column>
        <el-table-column prop="unit" label="单位" width="100"></el-table-column>
        <el-table-column prop="price" label="单价/元" width="100"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.status" active-text="已上架" inactive-text="已下架" size="mini" style="margin-right:20px" :active-value="1" :inactive-value="3" @change="onOffTrigger(scope.row)"></el-switch>
                <el-popconfirm title="确定删除此商品？" @onConfirm="handleDelete(scope.$index, scope.row)">
                    <el-link slot="reference" type="danger" class="margin-right-20">删除</el-link>
                </el-popconfirm>
                <el-link type="primary" @click="editGoods(scope.$index, scope.row)" style="margin-right:20px">编辑</el-link>
                <el-link type="primary" @click="showStockDialog(scope.row)" >库存明细</el-link>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" style="margin-top:10px"></el-pagination>

    <!-- 新增、编辑弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form :model="newGoods">
            <el-form-item label="商品名称" :label-width="formLabelWidth">
                <el-input v-model="newGoods.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片" :label-width="formLabelWidth">
                <el-upload list-type="picture-card"
                    :before-upload="beforeUpload" :http-request="importFile" :show-file-list="false"
                    action="default"
                   >
                    <img v-if="newGoods.imageUrl" :src="newGoods.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="单位" :label-width="formLabelWidth">
                <el-input v-model="newGoods.unit" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="数量" :label-width="formLabelWidth" v-if="!newGoods.id">
                <el-input-number v-model="newGoods.num" :min="1" :max="1000" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="单价" :label-width="formLabelWidth">
                <el-input v-model="newGoods.price">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitNewGoods">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 商品库存变化明细 -->
    <el-dialog :title="goodsStockName" :visible.sync="dialogTableVisible">
      <el-button size="mini" type="primary" @click="changeGoodsStock()">修改商品库存</el-button>
      <el-table :data="stockChangeList" size="mini">
        <el-table-column label="变化类型" width="100">
          <template slot-scope="scope">
            {{scope.row.change_type === 1 ? '入库' : scope.row.change_type === 2 ? '出库' : ''}}
          </template>
        </el-table-column>
        <el-table-column property="num" label="变化数量" width="100"></el-table-column>
        <el-table-column property="change_des" label="变化说明"></el-table-column>
        <el-table-column label="操作日期" width="150">
          <template slot-scope="scope">
            {{dayjs(scope.row.create_time).subtract(8, 'hour').format('YYYY-M-D HH:mm:ss')}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChangeStock" @current-change="handleCurrentChangeStock" :current-page="paginationStock.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="paginationStock.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationStock.total" style="margin-top:10px"></el-pagination>
      <el-dialog width="30%" title="修改库存" :visible.sync="innerVisible" append-to-body>
         <div class="filter-item">
            <span>变化类型： </span>
            <el-select size="mini" v-model="stockChangeType" placeholder="请选择">
              <el-option v-for="item in changeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="filter-item"><span>变化数量：</span> <el-input size="mini" placeholder="请输入内容" v-model="stockChangeNum" style="width: 100px"></el-input></div>
        <div class="filter-item"><span>变化说明：</span> <el-input size="mini" placeholder="请输入内容" v-model="stockChangeDesc" style="width: 120px"></el-input></div>
        <el-button size="mini" type="primary" @click="submitStockChange()">确定</el-button>
      </el-dialog>
    </el-dialog>
  </d2-container>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'goodsConfig',
  data () {
    return {
      dayjs,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      paginationStock: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogTitle: '新增商品',
      dialogFormVisible: false,
      dialogTableVisible: false,
      goodsName: '',
      goodsStatus: '',
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
      changeTypeOptions: [{
        label: '入库',
        value: 1
      }, {
        label: '出库',
        value: 2
      }],
      formLabelWidth: '120px',
      goodsList: [],
      stockChangeList: [],
      newGoods: {
        name: '',
        unit: '',
        num: 0,
        price: 0.00,
        imageUrl: ''
      },
      file: null,
      dialogVisible: false,
      goodsStockId: '',
      goodsStockName: '',
      stockChangeType: 1,
      stockChangeNum: 1,
      stockChangeDesc: '',
      innerVisible: false
    }
  },
  methods: {
    beforeUpload (file) {
      this.file = file
    },
    // 上传图片
    importFile () {
      const _this = this
      let fileData = new FormData()
      fileData.append('file', _this.file)
      fileData.append('staffNo', 100297)
      const url = '/uploadImage'
      this.uploadFile(url, fileData).then((res) => {
        if (res.data.code === 0) {
          _this.newGoods.imageUrl = res.data.data
          console.log(_this.newGoods)
        } else {
          console.log(res)
        }
      }, (rej) => {
        console.log(rej)
      })
    },
    // 新增或编辑商品点击确定提交数据
    submitNewGoods () {
      this.dialogFormVisible = false
      let data = this.newGoods
      data.staffNo = '100297'
      const id = this.newGoods.id
      if (id) {
        // 编辑商品
        this.$api.EDIT_GOODS(data).then((res) => {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.getAllGoods()
        })
      } else {
        this.$api.CREATE_GOODS(data).then((res) => {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
          this.getAllGoods()
        })
      }
    },
    // 删除商品
    handleDelete (index, row) {
      console.log(row)
      const data = {
        id: row.id,
        status: 2,
        staffNo: '100297'
      }
      this.$api.UPDATE_GOODS_STATUS(data).then((res) => {
        this.$message({
          type: 'success',
          message: '删除商品成功!'
        })
        this.getAllGoods(1)
      })
    },
    // 新增商品
    addGoods () {
      this.dialogTitle = '新增商品'
      this.dialogFormVisible = true
      this.newGoods = {
        name: '',
        unit: '',
        num: 0,
        price: 0.00,
        imageUrl: ''
      }
    },
    // 编辑商品
    editGoods (index, row) {
      this.dialogTitle = '编辑商品'
      this.dialogFormVisible = true
      this.newGoods = row
      this.newGoods.imageUrl = row.image_url
    },
    // 获取商品列表
    getAllGoods (page) {
      if (page) {
        this.pagination.currentPage = page
      }
      let data = {
        goodsName: this.goodsName,
        goodsStatus: this.goodsStatus,
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      this.$api.GET_ALL_GOODS(data).then((res) => {
        this.goodsList = res.list
        this.pagination.total = res.count
      })
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.getAllGoods()
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
      this.getAllGoods()
    },
    handleSizeChangeStock (val) {
      this.paginationStock.pageSize = val
      this.getStockRecordsById(this.goodsStockId)
    },
    handleCurrentChangeStock (val) {
      this.paginationStock.currentPage = val
      this.getStockRecordsById(this.goodsStockId)
    },
    // 商品上下架
    onOffTrigger (goods) {
      console.log(goods)
      const data = {
        id: goods.id,
        status: goods.status,
        staffNo: '100297'
      }
      this.$api.UPDATE_GOODS_STATUS(data).then((res) => {
        this.$message({
          type: 'success',
          message: '商品' + (goods.status === 1 ? '上架' : goods.status === 3 ? '下架' : '') + '成功!'
        })
        this.getAllGoods(1)
      })
    },
    // 展示库存明细弹框
    showStockDialog (record) {
      console.log(record)
      this.dialogTableVisible = true
      this.goodsStockId = record.id
      this.goodsStockName = record.name
      this.paginationStock.currentPage = 1
      this.paginationStock.pageSize = 10
      this.getStockRecordsById(this.goodsStockId)
    },
    // 根据商品id获取库存明细
    getStockRecordsById (id) {
      const data = {
        id: id,
        page: this.paginationStock.currentPage,
        pageSize: this.paginationStock.pageSize
      }
      this.$api.GET_STOCK_RECORDS(data).then((res) => {
        console.log(res)
        this.stockChangeList = res.list
        this.paginationStock.total = res.count
      })
    },
    // 修改库存明细记录
    changeGoodsStock () {
      this.innerVisible = true
      this.stockChangeType = 1
      this.stockChangeNum = 1
      this.stockChangeDesc = ''
    },
    submitStockChange () {
      const data = {
        goodsId: this.goodsStockId,
        changeType: this.stockChangeType,
        num: this.stockChangeNum,
        desc: this.stockChangeDesc,
        staffNo: '100297'
      }
      this.$api.ADD_STOCK_CHANGE_DETAIL(data).then((res) => {
        this.$message({
          type: 'success',
          message: '修改库存成功！'
        })
        this.innerVisible = false
        this.getStockRecordsById(this.goodsStockId)
        this.getAllGoods()
      })

    }
  },

  created () {
    this.getAllGoods()
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
</style>
