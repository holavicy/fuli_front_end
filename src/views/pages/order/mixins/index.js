import dayjs from 'dayjs'
export default {
    data () {
      return {
          dayjs,
          year: '',
          orderStatusOptions: [{
            label: '请选择',
            value:'',
          },{
            label: '待管理员确认',
            value: 1,
        },{
            label: '待领取',
            value: 3,
        },{
            label: '已领取',
            value: 4,
        }],
        orderStatusDict: {
            1: '待管理员确认',
            3: '待领取',
            4: '已领取'
        }
      }
    },

    methods: {
        // 获取订单信息
        getOrderList () {
            let data = {
            staffNo: '100297',
            page: this.pagination.currentPage,
            pageSize: this.pagination.pageSize,
            year: this.year ? dayjs(this.year).year() : '',
            status: this.orderStatus
            }
    
            this.$api.GET_LIST(data).then( res => {
            console.log(res)
            this.orderList = res.list
            this.pagination.total = res.count
            })
        }
    }
  }