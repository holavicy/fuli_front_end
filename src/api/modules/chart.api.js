export default ({ request }) => ({
  // 获取所有可领取人员列表
  GET_USER_LIST (data) {
    return request({
      url: '/getUserList?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&staffNo=' + (data.staffNo || '') + '&name=' + (data.name || '') + '&getStatus=' + data.getStatus + '&getYear=' + (data.getYear || '')+ '&startTime=' + (data.startTime || '') + '&endTime=' + (data.endTime || '')
    })
  },
  // 商品库存报表
  GOODS_STOCK_REPORT (data) {
    return request({
      url: '/goodsStockReport'
    })
  },
  // 商品入库明细报表
  GOODS_STOCK_IN_DETAIL_REPORT (data) {
    return request({
      url: '/goodsStockInDetailReport?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&beginDate=' + (data.beginDate || '') + '&endDate=' + (data.endDate || '') + '&goodsName=' + (data.goodsName || '')
    })
  },
  // 商品出库明细报表
  GOODS_STOCK_OUT_DETAIL_REPORT (data) {
    return request({
      url: '/goodsStockOutDetailReport?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&beginDate=' + (data.beginDate || '') + '&endDate=' + (data.endDate || '') + '&goodsName=' + (data.goodsName || '')
    })
  },
  // 礼包领取明细报表
  GIFT_RECORD (data) {
    return request({
      url: '/giftRecordReport?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&year=' + (data.year || '') + '&giftName=' + (data.giftName || '')
    })
  },
  
  // 礼包领取汇总报表
  GIFT_SUM_REPORT (data) {
    return request({
      url: '/giftSumReport?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&year=' + (data.year || '') + '&giftName=' + (data.giftName || '')
    })
  },

  // 整生日人员统计报表
  Z_BIRTH_STAFF (data) {
    return request({
      url: '/zBirthStaff?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&staffNo=' + (data.staffNo || '') + '&name=' + (data.name || '') + '&getYear=' + (data.getYear || '') + '&startTime=' + (data.startTime || '') + '&endTime=' + (data.endTime || '')
    })
  },
  // 花名册
  HUA_MING_CE (data) {
    return request({
      url: '/huaMingCe?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&staffNo=' + (data.staffNo || '') + '&name=' + (data.name || '') + '&getYear=' + (data.getYear || '')
    })
  }
})