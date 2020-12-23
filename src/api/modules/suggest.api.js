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
  },

  // 根据员工号获取当年的意见记录
  GET_SUGGEST_RECORDS (data) {
    return request({
      url: '/suggestRecords?staffNo=' + (data.staffNo || '')
    })
  }
})
