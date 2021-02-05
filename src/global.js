import axios from 'axios'

// 上传文件
function uploadFile (url, payload) {
  return new Promise(function (resolve, reject) {
    axios({
      baseURL: 'http://222.186.81.37:5000/giftApi/api',
      url: url,
      method: 'post',
      data: payload
    }).then(res => {
      resolve(res)
    }).catch(thrown => {
      reject(thrown)
    })
  })
}

// 获取时间的前七天日期
function get7DaysBefore(date){
      var date = date || new Date(),
          timestamp, newDate;
      if(!(date instanceof Date)){
          date = new Date(date.replace(/-/g, '/'));
      }
      timestamp = date.getTime();
      newDate = new Date(timestamp - 7 * 24 * 3600 * 1000);
      return [newDate.getFullYear(), formatNumber(newDate.getMonth() + 1), formatNumber(newDate.getDate())].join('-')
  }
  
  function formatNumber(n) {
      const number = Number(n)
      
      if (1<=number && number<=9) {
          return '0'+ String(number)
      } else {
          return String(number)
      }
  }

export default {
  install: function (Vue) {
    Vue.prototype.uploadFile = (url, payload) => uploadFile(url, payload)
    Vue.prototype.get7DaysBefore = (date) => get7DaysBefore(date)
    Vue.prototype.HOST_FILES = '222.186.81.37:5000/gift/'
  }
}
