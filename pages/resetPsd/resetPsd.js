// pages/resetPsd/resetPsd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus1: false,
    focus2: false,
    focus3: false,
    oldPsd1:'',
    newPsd1: '',
    newPsd2:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 获取焦点
  getFouces:function(e){
  
    var index = e.currentTarget.dataset.index
    if(index == '1'){
      this.setData({
        focus1:true,
        focus2: false,
        focus3: false,
      })
    } else if (index == '2'){
      this.setData({
        focus1: false,
        focus2: true,
        focus3: false,
      })
    }else if(index == '3'){
      this.setData({
        focus1: false,
        focus2: false,
        focus3: true,
      })
    }
  },

  // 修改密码
  sureChange:function(){
    var that = this
    if (this.data.oldPsd1.length == 0 || this.data.newPsd2.length == 0 || this.data.newPsd1.length == 0){
      this.showMessage('输入项不能为空')
    } else if (this.data.oldPsd3 != this.data.oldPsd2){
      this.showMessage('两次输入的新密码不相同')
    } else if (this.data.oldPsd1 == this.data.newPsd1){
      this.showMessage('新旧密码相同')
    }else{
      var user = wx.getStorageSync('user')
      var evalue = app.Encrypt()
      this.startLoading()
      wx.request({
        url: 'https://www.stsidea.com/weixin.asmx/UpdatePassWord',
        data: {
          userNo: user,
          userPw: this.data.oldPsd1,
          userNewPw: this.data.newPsd1,
          evalue: evalue
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "POST",
        dataType: "json",
        success: function(res) {
          that.endLoading()
          var result = res.data.replace(/<[^>]+>/g, "").replace(/[' '\r\n]/g, "").split("：")
          console.log(result)
          if (result[0] == '成功'){
            that.seccessLoading();
          }else{
            that.showMessage(result[1])
          }
        },
        fail: function(res) {
          that.endLoading()
          wx.showToast({
            title: '服务器阻塞，请稍后再修改',
            duration: 1500,
            mask: true,
          })
        },
        complete: function(res) {},
      })
    }
  },

  valueChange1:function(e){
    this.setData({
      oldPsd1: e.detail.value
    })
  },
  valueChange2: function (e) {
    this.setData({
      newPsd1: e.detail.value
    })
  },
  valueChange3: function (e) {
    this.setData({
      newPsd2: e.detail.value
    })
  },
  // 弹出提示信息
  showMessage:function(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      success: function(res) {
      },
    })
  },
  // 网络请求转菊花
  startLoading:function(){
    wx.showLoading()
  },
  endLoading:function(){
    wx.hideLoading()
  },
  // 修改成功
  seccessLoading(){
    var that = this
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
    setTimeout(function(){
      // 修改缓存数据的密码
      wx.setStorageSync('psd', that.data.newPsd1)
      // 返回上一层
      wx.navigateBack({
        delta: 1,
      })
    },1000)
   
  }

})