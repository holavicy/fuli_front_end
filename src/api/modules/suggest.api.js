export default ({ request }) => ({
  // 获取所有建议选项
  GET_SUGGEST_DICT (data) {
    return request({
      url: '/suggestDict'
    })
  },

  // 提交意见
  CREATE_SUGGEST (data) {
    return request({
      url: '/suggest',
      method: 'POST',
      data
    })
  }
})
