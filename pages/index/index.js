// index.js
// 获取应用实例
import {
  runInContext
} from '../../utils/evil-eval.es5.min';
const app = getApp()
const api = require('../../utils/api')
var util = require("../../utils/util.js")

Page({

  data: {
    time: {
      date: new Date().getDate(),
      month: new Date().getMonth(),
      day: new Date().getDay(),
    },
  },

  onshow() {
    var course = [];
    var that = this;
    var msg = "";
    var zc = 0;
    var configData = wx.getStorageSync('configData')
    var personalInformation = wx.getStorageSync('personalInformation')
    var curriculum = personalInformation.curriculum;
    if(!curriculum){
      return
    }
    let xq = new Date().getDay();
    if (xq == 0) {
      xq = 7;
    }
    for (let y = 0; y < curriculum.length; y++) {
      zc = curriculum[y].zc
      if (curriculum[y].xq == "7") {
        zc = String(Number(curriculum[y].zc) - 1)
      }
      if (zc == util.getweekString() && curriculum[y].xq == xq) {
        course.push({
          day: '今天',
          time: '第' + curriculum[y].jcdm[1] + '节',
          name: curriculum[y].kcmc,
          site: curriculum[y].jxcdmc,
        })
      }
      course.sort((b, a) => b.time.localeCompare(a.time, 'zh'))
    }
    personalInformation.curriculum = curriculum;
    wx.setStorageSync('personalInformation', personalInformation)
    if (course.length == 0) {
      var msg = "今天没有课哟～出去玩吧"
    }
    that.setData({
      ...configData,
      course: course,
      show: '',
      msg: msg,
    });
  },
  onLoad() {
    var that = this;
    that.onshow()
    // 加载icon
    api.get("https://api.test.com/api/index").then((res) => {
      // 图片缓存本地策略
      wx.setStorageSync('configData', res)
      for (let item in res.iconList) {
        res.iconList[item].icon = util.getStorageImage(res.iconList[item].icon);
      }
      that.setData(res);
      api.get("https://api.test.com/api/getPersonalInformation").then((res_data) => {
        wx.setStorageSync('personalInformation', res_data)
        that.onshow()
      })

    })
  },

})