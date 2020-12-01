export default ({ request }) => ({
  SEND_MESSAGE (data) {
    return request({
      url: '/sendMsg',
      method: 'POST',
      data
    })
  },

  SEND_SUPPLY_MESSAGE (data) {
    return request({
      url: '/sendSupplyMsg',
      method: 'POST',
      data
    })
  },

  // 调用jsapi前获取config
  JASPI_CONFIG (data) {
    return request({
      url: 'getConfig?url=' + data.url
    })
  },

  // 根据userid 获取 用户信息
  GET_INFO_BY_USER_ID (data) {
    return request({
      url: 'getUserInfoByUserId?userId=' + data.userId
    })
  }
})
