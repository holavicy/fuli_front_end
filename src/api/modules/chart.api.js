export default ({ request }) => ({
  // 获取所有可领取人员列表
  GET_USER_LIST (data) {
    return request({
      url: '/getUserList?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&staffNo=' + (data.staffNo || '') + '&name=' + (data.name || '') + '&getStatus=' + data.getStatus + '&getYear=' + (data.getYear || '')
    })
  }
})
