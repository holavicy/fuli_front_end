export default ({ request }) => ({
  DING_LOGIN (data) {
    return request({
      url: 'getUserInfo?code=' + data.code
    })
  }
})
