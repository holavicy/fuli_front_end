export default ({ request }) => ({
  // 获取代领列表
  GET_SUPPLY (data) {
    return request({
      url: '/supply?page=' + (data.page || '') + '&pageSize=' + (data.pageSize || '') + '&staffNo=' + (data.staffNo || '') +  '&supplyStaffNo=' + (data.supplyStaffNo || '') +'&year=' + (data.year || '')
    })
  },
  // 新增代领
  CREATE_SUPPLY (data) {
    return request({
      url: '/supply',
      method: 'post',
      data
    })
  },
  // 取消代领
  CANCEL_SUPPLY (data) {
    return request({
      url: '/cancelSupply',
      method: 'POST',
      data
    })
  }
})
