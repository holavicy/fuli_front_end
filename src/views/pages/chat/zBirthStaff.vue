<template>
  <d2-container>
    <template slot="header">
        <div class="action-wrapper">
            <div class="filter-item"><span>工号：</span> <el-input size="mini" placeholder="请输入内容" v-model="staffNoSearch"></el-input></div>
            <div class="filter-item"><span>姓名：</span> <el-input size="mini" placeholder="请输入内容" v-model="name"></el-input></div>
            <div class="filter-item"><span>年份：</span><el-date-picker size="mini" v-model="getYear" type="year" placeholder="请选择" :picker-options="pickerOptions"></el-date-picker></div>
            <div class="filter-item"><span>月份：</span><el-select size="mini" clearable v-model="getMonth" placeholder="请选择">
    <el-option
      v-for="item in monthOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></div>
            <el-button size="mini" type="primary" @click="getAllUsers()">查询</el-button>
            <el-button size="mini" type="primary" plain @click="exportFile()">导出</el-button>
        </div>
    </template>
    <el-table :data="goodsList" border style="width: 100%" size="mini" v-loading="loading">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="CODE" label="工号" width="80"></el-table-column>
        <el-table-column prop="group" label="公司" width="180"></el-table-column>
        <el-table-column label="一级部门" width="120">
           <template slot-scope="scope">
            {{scope.row.dept_list[0]}}
          </template>
        </el-table-column>
        <el-table-column label="二级部门" width="120">
          <template slot-scope="scope">
            {{scope.row.dept_list[1]}}
          </template>
        </el-table-column>
        <el-table-column label="三级部门" width="120">
          <template slot-scope="scope">
            {{scope.row.dept_list[2]}}
          </template>
        </el-table-column>  
        <el-table-column prop="NAME" label="姓名" width="180"></el-table-column>
        <el-table-column prop="BIRTHDATE" label="出生日期" width="120"></el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="120"></el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" style="margin-top:10px"></el-pagination>

  </d2-container>
</template>

<script>
import dayjs from 'dayjs'
import * as dd from 'dingtalk-jsapi'
import { mapActions } from 'vuex'
export default {
  name: 'staff',
  data () {
    return {
      today: new Date(),
      dayjs,
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },   
      staffNoSearch: '',
      name: '',
      getStatus: '',
      getYear: this.year,
      getMonth: '',
      options: [{
        label: '全部',
        value: ''
      }, {
        label: '未申请',
        value: 1
      }, {
        label: '待管理员确认',
        value: 2
      }, {
        label: '待领取',
        value: 3
      }, {
        label: '已领取',
        value: 4
      }],
      formLabelWidth: '120px',
      goodsList: [],
      userInfo: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date('2020-01-01 00:00:00')
        },
      },
      monthOptions: [ {
        value: 1,
        label: '一月'
      }, {
        value: 2,
        label: '二月'
      }, {
        value: 3,
        label: '三月'
      }, {
        value: 4,
        label: '四月'
      }, {
        value: 5,
        label: '五月'
      }, {
        value: 6,
        label: '六月'
      }, {
        value: 7,
        label: '七月'
      }, {
        value: 8,
        label: '八月'
      }, {
        value: 9,
        label: '九月'
      }, {
        value: 10,
        label: '十月'
      }, {
        value: 11,
        label: '十一月'
      }, {
        value: 12,
        label: '十二月'
      }]
    }
  },
  computed: {
    year: function () {
      return this.today.getFullYear()
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

    // 获取列表
    getAllUsers (page) {
      this.loading = true
      if (page) {
        this.pagination.currentPage = page
      }
      let data = {
        staffNo: this.staffNoSearch,
        name: this.name,
        getStatus: this.getStatus,
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        getYear: this.getYear ? dayjs(this.getYear).endOf('year').format('YYYY-M-D') : dayjs(this.today).endOf('year').format('YYYY-M-D')
      }
      console.log(this.getMonth)
      if (this.getMonth) {
        const getYear = this.getYear ? dayjs(this.getYear).year() : dayjs(this.today).year()
        const searchDate = String(getYear)+'-'+String(this.getMonth)+'-01'
        const startTime = dayjs(searchDate).startOf('month').format('YYYY-MM-D HH:mm:ss')
        const endTime = dayjs(searchDate).endOf('month').format('YYYY-MM-D HH:mm:ss')
        console.log(startTime)
        console.log(endTime)
        data.startTime = startTime        
        data.endTime = endTime
      }
      
      this.$api.Z_BIRTH_STAFF(data).then((res) => {
        this.loading = false
        this.goodsList = res.list
        this.pagination.total = res.count
      })
    },
    exportFile () {
      this.loading = true
      let data = {
        staffNo: this.staffNoSearch,
        name: this.name,
        getStatus: this.getStatus,
        getYear: this.getYear ? dayjs(this.getYear).endOf('year').format('YYYY-M-D') : dayjs(this.today).endOf('year').format('YYYY-M-D')
      }

      if (this.getMonth) {
        const getYear = this.getYear ? dayjs(this.getYear).year() : dayjs(this.today).year()
        const searchDate = String(getYear)+'-'+String(this.getMonth)+'-01'
        const startTime = dayjs(searchDate).startOf('month').format('YYYY-MM-D HH:mm:ss')
        const endTime = dayjs(searchDate).endOf('month').format('YYYY-MM-D HH:mm:ss')
        data.startTime = startTime        
        data.endTime = endTime
      }
      
      this.$api.EXPORT_Z_STAFF(data).then((res) => {
        this.loading = false
        const href = 'http://' + this.HOST_FILES + res.url
        window.location.href = href
        this.$message.success('导出成功')
      }).catch(e => {
        this.loading = false
        this.$message.error('导出失败')
      })
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.getAllUsers()
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val
      this.getAllUsers()
    }
  },

  created () {
    this.load()
    this.getAllUsers()
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
