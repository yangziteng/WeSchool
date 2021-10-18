const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const fileSystem = wx.getFileSystemManager()


/*
建议只放小图片
图片缓存只针对屡次访问的图片，请按照实际状况调用。若是访问一次的也作，CDN流量消耗反倒翻倍，得不偿失。
小程序缓存最大10M。为防止将缓存写满，小程序初始化时，若是超过1000条，清空缓存记录，从新开始。
1000条。该数不是固定数字，请根据本身的实际状况自定。若是你自己就会往Storage放数据，请自行判断须要多少条，不要致使其余数据没法存入，影响其余功能正常使用。
为何不用LRU最近使用删除？不必。1000自己是个虚数，留存1~2M作其余代码备用，而文件异步保存，自己会致使有好多文件没法检测到，若是经过循环去判断最近时间，太耗费性能，还不如进入小程序时，直接清空，从头开始。小程序自己是轻量级的，一段时间清空一次便可
*/
const getStorageImage = (web_image) => {
  let webImages = wx.getStorageSync('webImages') || []
  let webImage = webImages.find(y => y.web_path === web_image)
  if (webImage) {
    try {
      fileSystem.accessSync(webImage.local_path)
      return webImage.local_path
    } catch(e) { 
      let webImageIdx = webImages.findIndex(y => y.web_path === web_image)
      webImages.splice(webImageIdx, 1)
      wx.setStorageSync('webImages', webImages)
    }
  } else {
    wx.downloadFile({
      url: web_image,
      success (res) {
        if (res.statusCode === 200) {
          let filePath = res.tempFilePath
          let webImageStorage = wx.getStorageSync('webImages') || []
          let storage = {
            web_path: web_image,
            local_path: filePath,
            last_time: Date.parse(new Date()),
          }
          webImageStorage.push(storage)
          wx.setStorageSync('webImages', webImageStorage)
        }
      }
    })
  }
  return web_image
}

// 计算周数
const getweekString = () => {
  if(getApp().globalData.whichWeek){
    return getApp().globalData.whichWeek
  }
  var Date1 = new Date();
  if(!wx.getStorageSync('configData')){
    return 1;
  }
  var Date2 = new Date(wx.getStorageSync('configData').timeYear);
  var dayOfWeek = Date2.getDay();
  var day1fWeek = Date1.getDay();
  //如果把周日算在一周的最后一天，请加上下面这句
  dayOfWeek = dayOfWeek == 0 ? 7 : dayOfWeek
  //如果把周日算在一周的第一天，请删除上面这句
  var num = (Date1 - Date2) / 1000 / 3600 / 24;
  var whichWeek = Math.ceil((num + dayOfWeek) / 7);
  if (day1fWeek == 0) {
    whichWeek = whichWeek - 1;
  }
  return whichWeek;
}

module.exports = {
  getStorageImage,
  formatTime,
  getweekString
}
