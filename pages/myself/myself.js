// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    list:[
      {
        icon: "images/aboutUs.png",
        title: "关于我们",
        click: "about"
      }, {
        icon: "images/update.png",
        title: "更新日志",
        click: "journal"
      }, {
        icon: "images/login.png",
        title: "登录/注销账号",
        click: "login"
      }
    ]
  },
  onLoad() {
    
  },
  
  about(e){
    console.log(e)
    console.log("关于我们")
  },
  journal(e){
    console.log(e)
    console.log("更新日志")
  },
  login(e){
    console.log(e)
    console.log("登录/注销账号")
  }

  
})
