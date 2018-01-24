// pages/searchList/searchList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
  },

  // 网络请求
  getInfoList(params){
    this.showToast()
    var evalue = app.Encrypt()
    
    wx.request({
      url: 'https://www.stsidea.com/weixin.asmx/GetAssetInfoByMultipleAttributes',
      data: {
        AttributeName: params,
        evalue: evalue
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      // dataType: json,
      success: (res) =>{
        this.moveToase()
        var resultArr = res.data.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "").replace(/[ ]/g, "").split("：")
       
        if (resultArr[0]=="成功"){
          var result = res.data.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "").replace(/[ ]/g, "").substring(3).split("|")        
          var tempArr = new Array()
          for(var i = 0;i<result.length;i++){
            // 将数字中的字符串用”，“隔开，做成数组
            tempArr.push(result[i].split(","))
          }
        
          this.setData({
            list: tempArr
          })
        }else{
          this.showAlertMessage(resultArr[1])
        }

      },
      fail: function(res) {
        this.moveToase()
        wx.showToast({
          title: '网络阻塞',
          duration: 1000,
          mask: true
        })
      },
      complete: (res) =>{
     
      },
    })
  },


  // 跳转到下一个页面
  showSearch(event){
    var index = parseInt(event.currentTarget.dataset.index);
    console.log(this.data.list[index])
    // 要传递到下一个界面的数组
    var model = JSON.stringify(this.data.list[index])
    wx.navigateTo({
      url: '../enquire/enquire?model='+model,
    })
  },


// 显示加载信息
  showToast(){
    wx.showLoading({
      title: '正在加载',
    })
  },
  // 取消加载信息
  moveToase(){
    wx.hideToast()
  },
// 显示提示信息
showAlertMessage(msg){
  wx.showModal({
    title: '提示',
    content: msg,
    success: function (res) {
      if (res.confirm) {
        // 返回上一个界面
        wx.navigateBack({
          delta: 1,
        })
      } else if (res.cancel) {
      //  返回上一个界面
        wx.navigateBack({
          delta: 1,
        })
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var paramsArr = JSON.parse(options.model) 
    var params = paramsArr.join(",").replace(/[:]/g, "=")
    console.log(params)
   
    // 显示加载提示
    this.showToast()
    // 进行网络请求
    this.getInfoList(params)
  },

})