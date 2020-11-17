export default ({ request }) => ({
  SEND_MESSAGE (data) {
    return request({
      url: '/sendMsg',
      method: 'POST',
      data
    })
  }
})
