export default ({ request }) => ({
  // 获取钉钉用户信息
  DING_LOGIN (data) {
    return request({
      url: 'getUserInfo?code=' + data.code
    })
  },

  // 获取NC用户信息
  GET_USERINFO_NC (data) {
    return request({
      url: '/getUserInfoNC?code=' + data.code
    })
  }
})
