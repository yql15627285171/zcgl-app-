const CryptoJS = require('./utils/AES')
const dataUtil = require('./utils/util.js') 
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 程序开始的都是都认为是还没有登录
    wx.setStorage({
      key: 'alreadLogin',
      data: false,
    })  
  
   wx.onNetworkStatusChange(function(res){
     if (res.networkType == 'none' || res.networkType =='unknown'){

      //  wx.setNavigationBarColor({
      //    frontColor: '#ffffff',
      //    backgroundColor: '#ff0000',
      //    animation: {
      //      duration: 400,
      //      timingFunc: 'easeIn'
      //    }
      //  });
      //  wx.showNavigationBarLoading();
      wx.showLoading({
        title: '手机网络不通',
        mask: true,
      })

     }else{
      // wx.hideNavigationBarLoading();
      // wx.setNavigationBarColor({
      //   frontColor: '#ffffff',
      //   backgroundColor: '#465064',
      //   animation: {
      //     duration: 400,
      //     timingFunc: 'easeIn'
      //   }
   
      
      // })
      wx.hideLoading()
     }
  
  
  })
  },
  Encrypt: function (data) {
   
  
    var key = CryptoJS.enc.Latin1.parse('j>r%T.w8#7*6J\"r%T.w8#7*6');
    var iv = CryptoJS.enc.Latin1.parse('a@ss<_2et.T^&r\"j');
    
    var ADEData
    if(data == null){
      ADEData = dataUtil.formatTime1(new Date())
    }else{
      ADEData = data +'$'+ dataUtil.formatTime1(new Date())
    }
    console.log(ADEData)
    return CryptoJS.AES.encrypt(ADEData, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString();
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
