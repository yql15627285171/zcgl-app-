// main.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // code_message:'',
    alreadLogin:false,  //判断刚进入界面的时候，是否已经进行过账号密码检验
    administor:false,//判断登录的是否为管理员
  
    canScan:true,//false能扫，true不能扫
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 确认身份
    this.identifyAdministor();

    var login = wx.getStorageSync('alreadLogin')
    // console.log(login)
  //  判断是否已经进行过登录操作
  // 如果不是则进行登录
    if (!login){
      // 包含87用户判断在此方法
      this.login();
    }else{
      if(wx.getStorageSync("startTask") == '1'){
        this.setData({
          alreadLogin: true,
          canScan: false
        })
      }else{
        this.setData({
          alreadLogin: true,
          canScan: true
        })
      }
      // console.log(this.data.canScan)
      // 876用户判断
      this.judge876User(); 
    }  

    
  },



// 扫码
  scan:function(e){
          //   wx.navigateTo({
          //   url: '../scanInfo/scanInfo?num=' + '0200230'
          // })
    if (!this.data.alreadLogin){
      this.showTips();
    }else{
      var that = this;
      wx.scanCode({
        onlyFromCamera: true,
        success: function (res) {
          // 扫描成功，返回数据
          console.log(res.result)
          //把扫描设备的的最新信息反馈给客户
          wx.navigateTo({
            url: '../scanInfo/scanInfo?num=' + res.result
          })

        },
        fail: function (res) {
          // 扫码失败，反馈给用户
        }

      })
    }
   
  },

//查询设备
  equipmentCheck:function(){
    if (!this.data.alreadLogin) {
      this.showTips();
    }else{
      // 保存操作类型
     wx.setStorage({
       key: 'searchType',
       data: 'equip',
     })
      wx.navigateTo({
        // url: '../enquire/enquire?type=1',
        url:'../condition/condition'
      })
    }
      
  },

//历史操作
  checkHistroy:function(){
    
    if (!this.data.alreadLogin) {
      this.showTips();
    }else{
      // 保存操作类型
      wx.setStorage({
        key: 'searchType',
        data: 'histroy',
      })
      wx.navigateTo({
        // url: '../enquire/enquire?type=2',
        url:'../condition/condition'
      })
    }

    
  },


  

  // 自动登录
  login:function(){
   

    var that = this
    var psd = wx.getStorageSync('psd')
    var user = wx.getStorageSync('user')
    var evalue = app.Encrypt()
    if(psd && user){
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      // 进行网络请求
      wx.request({
        url: 'https://www.stsidea.com/weixin.asmx/UserLoad',
        data: {
          userNo:user,
          userPw:psd,
          evalue: evalue
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success: function(res) {
         
          var result = res.data.replace(/<[^>]+>/g, "").replace(/[' '\r\n]/g, "").split(":")
          console.log(result)
          if (result[0] =="成功"){
            var info = result[1].split(",")
            console.log(info[3])
            if (info[3] == '1') {
              that.setData({
                alreadLogin: true,
                canScan: false
              })
            } else {
              that.setData({
                alreadLogin: true,
                canScan: true
              })
            }
          

            // console.log(that.data.canScan)
            // 876用户判断
            that.judge876User(); 


          }else{
            // 登录失败，提示客户登录
            wx.clearStorage()
            that.showTips();
          }
        },
        fail:function(res){
          wx.hideLoading()
          wx.showToast({
            title: '服务器阻塞，请下拉刷新重新登录',
            duration: 1500,
            mask: true,
          })
        },
        complete:(res)=>{
          // wx.hideNavigationBarLoading();
          wx.hideLoading()
          // 停止下拉刷新
          wx.stopPullDownRefresh()
          
        }
      })
      
      
 

    }else{
      // 弹出视图，返回登录界面
      this.showTips();
    }


  },

  // 弹框提示
  showTips:function(){
    wx.showModal({
      title: '提示',
      content: '请进行登录',
      success:function(res){
        if (res.confirm) {
          console.log('用户点击确定')
          // 返回登录界面
          wx.redirectTo({
            url: '../index/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          // 不做任何动作
        }
      }
    })
  },

  // 确认登录着身份
  identifyAdministor:function(){
    // 判断是否管理员进行界面功能控制
    if (wx.getStorageSync('administor') == "y") {
      this.setData({
        administor:true
      })
    }
  },

  // 扫码登录网站
  loginWeb:function(){

    if (!this.data.alreadLogin) {
      this.showTips();
    } else {
      var that = this;
      wx.scanCode({
        onlyFromCamera: true,
        success: function (res) {
        
          // 惊醒网络请求
          that.loginRequest(res.result)
        },
        fail: function (res) {
          // 扫码失败，反馈给用户
        }

      })
    }
  },

  loginRequest:function(guid){
    var userNo = wx.getStorageSync('user')
    var evalue = app.Encrypt()
    wx.request({
      url: 'https://www.stsidea.com/weixin.asmx/QRCodeScanResult',
      data:{
        guid:guid,
        userNo: userNo,
        evalue: evalue
      } ,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: "POST",
      dataType: "json",
      success: function(res) {
       var result = res.data.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "").split("：")
       if (result[0] == '失败'){
         wx.showModal({
           title: result[1],
         })
       }

      },
      fail: function(res) {
        wx.showToast({
          title: '服务器阻塞',
          duration: 1500,
          mask: true,
        })
      },
      complete: function(res) {},
    })
  },

  /**
   * 如果user等于876，则没有扫描权限
   */
  judge876User:function(){
    var user = wx.getStorageSync('user')
    if(user == '876'){
      this.setData({
        canScan: true //false能扫，true不能扫
      })
    }
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log("刷新")
    // 下拉刷新，重新登录一次，
    this.login()

  },

  


 




})