import dayjs from 'dayjs'
import { mapActions } from 'vuex'
export default {
    data () {
      return {
        dayjs,
        year: '',
        staffNo: '',
        staffName: '',
        creator: '',
        creatorName: '',
        orderList:[] ,
        orderStatusOptions: [{
          label: '请选择',
          value:'',
        }, {
          label: '待管理员确认',
          value: 1,
        }, {
          label: '已取消',
          value: 2,
        }, {
          label: '待领取',
          value: 3,
        }, {
          label: '已领取',
          value: 4,
        }],
        orderStatusDict: {
          1: '待管理员确认',
          2: '已取消',
          3: '待领取',
          4: '已领取'
        },
        userInfo: {}
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
        this.staffNo = userInfo.staffNo
        this.userInfo = userInfo
        this.getOrderList()
      },
      // 获取订单信息
      getOrderList (page) {
        if (page) {
          this.pagination.currentPage = page
        }
        let data = {
          staffNo: this.staffNo,
          staffName: this.staffName,
          creator: this.creator,
          creatorName: this.creatorName,
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          year: this.year ? dayjs(this.year).year() : '',
          status: this.orderStatus
        }

        this.$api.GET_LIST(data).then( res => {
          this.orderList = res.list
          console.log(this.orderList.length)
          this.pagination.total = res.count
        })
      },
      // 确认收货
      finishOrder (order) {
        this.$confirm('确定已领取此生日礼包?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const data = {
              orderId: order.id,
              status: 4,
              staffNo: this.userInfo.staffNo,
              staffName: this.userInfo.name
            }
            this.$api.EDIT_ORDER_STATUS(data).then((res) => {
              this.$message.success('礼包领取完成')
              this.getOrderList()
            })
        }).catch(() => {
          console.log('取消确认收货')
        })   
      },
      handleSizeChange (val) {
        this.pagination.pageSize = val
        this.getOrderList()
      },
      handleCurrentChange (val) {
        this.pagination.currentPage = val
        this.getOrderList()
      }
    }
  }