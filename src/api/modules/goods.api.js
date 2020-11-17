export default ({ request }) => ({
  // 获取商品列表
  GET_ALL_GOODS (data) {
    return request({
      url: '/goods?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&goodsName=' + (data.goodsName || '') + '&goodsStatus=' + data.goodsStatus
    })
  },
  // 新增商品
  CREATE_GOODS (data) {
    return request({
      url: '/goods',
      method: 'post',
      data
    })
  },
  // 修改商品状态 1：上架 2：删除 3：下架
  UPDATE_GOODS_STATUS (data) {
    return request({
      url: '/setGoodsStatus',
      method: 'post',
      data
    })
  },
  // 修改商品基础信息(名称、图片、单位、单价)
  EDIT_GOODS (data) {
    return request({
      url: '/updateGoodsInfo',
      method: 'post',
      data
    })
  },
  // 根据商品id获取库存变化明细
  GET_STOCK_RECORDS (data) {
    return request({
      url: '/getStockRecords?id=' + data.id + '&page=' + data.page + '&pageSize=' + data.pageSize
    })
  },
  // 根据id新增商品库存变化明细
  ADD_STOCK_CHANGE_DETAIL (data) {
    return request({
      url: '/addStockChangeDetail',
      method: 'POST',
      data
    })
  }
})
