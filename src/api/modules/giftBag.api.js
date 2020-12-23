export default ({ request }) => ({
  // 新增礼包
  ADD_GIFT_BAG (data) {
    return request({
      url: '/giftBag',
      method: 'POST',
      data
    })
  },
  // 获取礼包列表
  GET_GIFTS (data) {
    return request({
      url: 'giftBag?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&giftName=' + data.giftName + '&goodsName=' + data.goodsName + '&giftStatus=' + data.giftStatus + '&staffNo=' + (data.staffNo || '')
    })
  },
  // 修改礼包状态 1：上架 2：删除 3：下架
  UPDATE_GIFTBAG_STATUS (data) {
    return request({
      url: '/setGiftBagStatus',
      method: 'post',
      data
    })
  },
  // 编辑礼包
  EDIT_GIFT_BAG (data) {
    return request({
      url: '/editGiftBag',
      method: 'POST',
      data
    })
  }
})
