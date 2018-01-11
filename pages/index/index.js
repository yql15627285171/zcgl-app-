var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:"",
    psd:"",
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

  // 记录账户输入框内容
  userName:function(e){
      this.setData({
        user:e.detail.value
      })
  },

  //记录密码输入框内容
  password:function(e){
    this.setData({
      psd: e.detail.value
    })
  },

  login:function(event){
    var that = this;

    var psd = this.data.psd;
    var user = this.data.user;



    // 判断账号密码的有效性
    if ( psd.trim().length > 0 && user.trim().length>0)
    {
      // 进行网络请求
      this.showLoading();
      var evalue = app.Encrypt()
      wx.request({
        url: 'https://www.stsidea.com/weixin.asmx/UserLoad',
        data: {
          userNo: user,
          userPw: psd,
          evalue: evalue
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success: function (res) {
       
          console.log(res.data)
          var result = res.data.replace(/<[^>]+>/g, "").replace(/[' '\r\n]/g, "").split(":")
          console.log(result)
          if (result[0] == "成功") {
           
            // 成功跳转页面，并且存储数据
            var userInfo = result[1].split(",")
            wx.setStorage(
              {
              key: 'user',
              data: user,
            })

            wx.setStorage({
              key: 'psd',
              data: psd,
            })

            wx.setStorage({
              key: 'name',
              data: userInfo[1],
      
            })
            wx.setStorageSync("administor", userInfo[2])
            wx.setStorageSync("startTask", userInfo[3])
            // wx.setStorage({
            //   key: 'administor',
            //   data: userInfo[2],

            // })
            wx.setStorage({
              key: 'alreadLogin',
              data: true,
            })

            wx.switchTab({
              url: '../main/main',
            })
          }
           

          // 无论成功还是失败都提示用户
          that.endLoading(result[0])
        },
        fail:function(res){
          that.endLoading('服务器阻塞')
        },
      })   

     
    }
   
   
  },

  // 提示用户正在登录
  showLoading:function(){
    wx.showLoading({
      title: '正在登录',
      mask: true,
    })
  },

  // 网络请求完之后提示用户
  endLoading:function(msg){
    wx.hideLoading();    
    wx.showToast({
      title: msg,
      duration: 1500
    })  
  },

  // 调试用的接口helloword
  // test:function(){
  //   var params = {
  //     evalue :app.Encrypt()
  //   }

  //   http.POST(api.test,params,{
  //     success:function(res){
  //       console.log(res.data)
  //     },
  //     fali:function(res){

  //     }
  //   })
  // },


 








})