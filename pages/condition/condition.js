// pages/condition/condition.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assetNo:'',
    keeperName:'',
    assetName:'',
    choseLevel1:'请选择',
    choseLevel2:'请选择',
    keeperPartLever1:null,
    keeperPartLever2:null,
    // 弹出层背景的控制
    showBG: false,
    // 弹出层控制
    showPlace: false,
    // 选择列项
    info:[],
  },
  // 扫码转跳
  scanSearch(){
    var itemArr = new Array()
    wx.scanCode({
      onlyFromCamera: true,
      success: function(res) {
        console.log(res.result)
        itemArr.push('AssetNo:' + res.result)
        var model = JSON.stringify(itemArr)
        wx.navigateTo({
          url: '../searchList/searchList?model=' + model,
        })
      },
    })
  },

  // 跳转下一页
  search() {
    var itemArr = new Array()
    if (this.data.assetNo.length != 0){
      // attributeName += 'AssetNo='+ this.data.assetNo
      itemArr.push('AssetNo:' + this.data.assetNo)
      
    }
    if (this.data.keeperName.length != 0){
      // attributeName += ',' + 'KeeperName=' + this.data.keeperName
      itemArr.push('KeeperName:' + this.data.keeperName)
    }
    if (this.data.choseLevel1!= '请选择') {
      // attributeName += ',' + 'KeeperPartLever1=' + this.data.choseLevel1
      itemArr.push('KeeperPartLever1:' + this.data.choseLevel1)
    }
    if (this.data.choseLevel2 != '请选择') {
      // attributeName += ',' + 'KeeperPartLever2=' + this.data.choseLevel2
      itemArr.push('KeeperPartLever2:' + this.data.choseLevel2)
    }
    
    if (itemArr.length != 0){
      // var attributeName = itemArr.join(",")
      // console.log(attributeName)
      var model = JSON.stringify(itemArr)
      console.log(model)
        wx.navigateTo({
          url: '../searchList/searchList?model=' + model,
        })
    }else{
      // 弹框提示
      this.showMessage('请输入选择条件')
    }
   
  },
  // 获取设备种类和当前中心
  getTypesAndCenter(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var evalue = app.Encrypt()
      wx.request({
        url: 'https://www.stsidea.com/weixin.asmx/GetItemsNameList',
        data: { 
          itemsName:'KeeperPartLever1,KeeperPartLever2',
          evalue: evalue
          },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        // dataType: 'json',
        success: (res)=> {
          wx.hideLoading()
          //由JSON字符串转换为JSON对象
          var result = res.data.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "").replace(/[ ]/g, "")
      
          var jsonRes = JSON.parse(result)
    
          this.setData({
            keeperPartLever1: jsonRes.KeeperPartLever1,
            keeperPartLever2: jsonRes.KeeperPartLever2
          })

        },
        fail: function(res) {
          wx.hideLoading()
          wx.showToast({
            title: '网络阻塞',
            duration: 1000,
            mask: true,
            success: function(res) {
              that.goBack()
            },
          })
        },
        complete: function(res) {
          
        },
      })
  },

  // 弹出提示框
  showMessage(message){
    wx.showModal({
      title: '提示',
      content: message,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  // 选择菜单
  choiceItem(event){
    var index = event.currentTarget.dataset.index;
    if (index || index == 0) {
      if (this.data.info.length == this.data.keeperPartLever1.length){
   
        this.setData({
          choseLevel1: this.data.info[index]
        })
      } else if (this.data.info.length == this.data.keeperPartLever2.length){
  
        this.setData({
          choseLevel2: this.data.info[index]
        })
      }
    }
    this.disappear();
  },
// 输入框内容改变
  valueChange(event){
    if (event.currentTarget.dataset.type == 'number'){
        this.setData({
          assetNo: event.detail.value
        })
    } else if (event.currentTarget.dataset.type == 'person'){
      this.setData({
        keeperName: event.detail.value
      })
    }
  },
  // 显示隐藏
  showAlert: function (e) {
 
    var viewLevel = e.target.dataset.level
    if (viewLevel == '1'){
      this.setData({
        showBG: true,
        showPlace: true,
        info: this.data.keeperPartLever1
      })
    } else if (viewLevel == '2'){
      this.setData({
        showBG: true,
        showPlace: true,
        info: this.data.keeperPartLever2
      })
    }
    
  },

  disappear: function () {
    this.setData({
      showBG: false,
      showPlace: false
    })
  },

  // 返回上一个页面
  goBack:function(){
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypesAndCenter()
  }


})