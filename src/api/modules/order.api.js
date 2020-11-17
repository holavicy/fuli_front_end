export default ({ request }) => ({
  // 创建订单
  CREATE_ORDER (data) {
    return request({
      url: '/createOrder',
      method: 'POST',
      data
    })
  },
  // 获取订单
  GET_LIST (data) {
    return request({
      url: '/getOrderList?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&staffNo=' + (data.staffNo || '') + '&year=' + data.year + '&orderStatus=' + data.status
    })
  },
  // 修改订单状态
  EDIT_ORDER_STATUS (data) {
    return request({
      url: '/editOrderStatus',
      method: 'POST',
      data
    })
  }
})
