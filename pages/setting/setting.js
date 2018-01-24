// setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    num:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this

   wx.getStorage({
     key: 'name',
     success: function(res) {
       that.setData({
         name:res.data
       })
     },
   })

   wx.getStorage({
     key: 'user',
     success: function(res) {
       that.setData({
         num:res.data
       })
     },

   })


  },
  // 退出登录
  logOut:function(){
    // 清理缓存
    wx.clearStorage();
    // 返回登录界面
    wx.reLaunch({
      url: '../index/index',
    })
  },

  // 修改密码
  resetPsd:function(){
    var user = wx.getStorageSync('user')
    if (user == '876'){
      wx.showModal({
        title: '提示',
        content: '改账户不能修改密码',
      })
    }else{
      wx.navigateTo({
        url: '../resetPsd/resetPsd',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  }

 
})