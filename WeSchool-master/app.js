// app.js
App({
  onLaunch() {

    let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
    console.log("rect", rect)
    // 获取设备信息
    wx.getSystemInfo({
      success: res => {
       // 胶囊高度
       this.globalData.rectHeight = rect.height;
       // 获取屏幕宽度
        let windowWidth = res.windowWidth;
       // 获取状态栏的高度
        let statusBarHeight = res.statusBarHeight;
        this.globalData.statusBarHeight = statusBarHeight;
       // 根据胶囊的位置计算文字的行高以及距离状态栏文本的位置
        let lineHeight = (rect.top - statusBarHeight) * 2 + rect.height;
        this.globalData.lineHeight = lineHeight;
       // 根据胶囊的位置计算距离右侧的宽度，用于设置返回按钮至左侧的距离
        let leftDistance = windowWidth - rect.right;
        this.globalData.leftDistance = leftDistance;
      },
      fail: erro => {
        console.log(res)
      }

       })

  },
  globalData: {
    userInfo: null
  }
})
