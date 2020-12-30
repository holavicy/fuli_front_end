export default ({ request }) => ({
  // 导出所有商品
  EXPORT_ALL_GOODS (data) {
    return request({
      url: '/exportGoods?goodsName=' + (data.goodsName || '') + '&goodsStatus=' + data.goodsStatus
    })
  },
  // 导出商品库存报表
  EXPORT_CHART_GOODS (data) {
    return request({
      url: '/exportChartGoods'
    })
  },
  // 导出商品入库明细表
  EXPORT_ALL_GOODS_STOCK_IN (data) {
    return request({
      url: '/exportGoodsStockInDetailReport?beginDate=' + (data.beginDate || '') + '&endDate=' + (data.endDate || '') + '&goodsName=' + (data.goodsName || '')
    })
  },
  // 导出商品出库明细表
  EXPORT_ALL_GOODS_STOCK_OUT (data) {
    return request({
      url: '/exportGoodsStockOutDetailReport?beginDate=' + (data.beginDate || '') + '&endDate=' + (data.endDate || '') + '&goodsName=' + (data.goodsName || '')
    })
  },
  // 导出礼包领取明细表
  EXPORT_GIFT (data) {
    return request({
      url: '/exportGift?year=' + (data.year || '') + '&giftName=' + (data.giftName || '')
    })
  },
  // 导出礼包领取明细表
  EXPORT_GIFT_SUM (data) {
    return request({
      url: '/exportGiftSum'
    })
  },
  // 导出一般生日礼包人员统计
  EXPORT_STAFF (data) {
    return request({
      url: '/exportStaff?staffNo=' + (data.staffNo || '') + '&name=' + (data.name || '') + '&getStatus=' + data.getStatus + '&getYear=' + (data.getYear || '')
    })
  },
  // 导出整生日礼包人员统计
  EXPORT_Z_STAFF (data) {
    return request({
      url: '/exportZStaff?staffNo=' + (data.staffNo || '') + '&name=' + (data.name || '') + '&getStatus=' + data.getStatus + '&getYear=' + (data.getYear || '')
    })
  }
})
