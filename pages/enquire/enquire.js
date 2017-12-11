// enquire.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  finishLoading:false, //判断是否网络请求完毕
  searchType:'',
  equipment_info:[
    // '资产编号: ',
    // '设备名称: ',
    // '品牌: ',
    // '型号: ',
    // '规格: ',
    // '出厂编号: ',
    // '行政部编号: ',
  ],
  picUrl:"", //图片路径
  histroy_info:null,
  value:"",  //搜索框的值
  searchNum:'' 
    
  


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 传过来的数据
    var model = JSON.parse(options.model)

    // storage的数据
    var type = wx.getStorageSync('searchType')

    this.setData({
      searchType:type,
      searchNum: model[0]
    })


    if(type=='equip'){
      this.showEquip(model);
    // 设备查询信息
    
    // ①设置标题
    wx.setNavigationBarTitle({
      title: '设备信息',
    })
    

    }else{
      // 看看历史操作
      this.showHistroy(),
    
    // ①设置标题
      wx.setNavigationBarTitle({
        title: '历史操作',
      })
   
    }
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  showEquip(model){
    this.showLoading();
    // 下载图片
    this.downloadImage(this.data.searchNum)
    // 加载设备信息
    this.searchEquipment(model)
  },

  showHistroy(){
    // 显示加载
    this.showLoading();
    this.searchHistroy(this.data.searchNum)
  },

  // 下载设备图片
  downloadImage: function (num) {
    var that = this
    wx.downloadFile({
      url: 'https://www.stsidea.com/Images/' + num + '.jpg',

      success: function (res) {
        
        if (res.statusCode == 200){
          that.setData({
            picUrl: res.tempFilePath
          })
        }
        
      },
      fail: function (res) { },
      complete: function (res) {
        that.endLoading()
      },
    })
  },


  //查询信息
  searchEquipment: function (model) {

        var result = model
        this.setData({
          equipment_info: [
            '资产编号: ' + result[0],//资产编号
            '设备名称: ' + result[1],//设备名称
            '品牌: ' + result[2],//品牌
            '型号: ' + result[3],//型号
            '规格: ' + result[4],//规格
            '出厂编号: ' + result[5],//出厂编号
            '行政部门编号: ' + result[6],//行政部门编号
            '序列号: ' + result[7],//序列号
            '资产原值: ' + result[8],//资产原值
            '购置日期:  ' + result[9],//购置日期
            '负责人: ' + result[10],//负责人
            '当前中心: ' + result[11],//当前中心
            '使用部门: ' + result[12],//部门
            '存档地点: ' + result[13],//存档地点
            '生产厂家:  ' + result[14],//生产厂家
            '国产/进口: ' + result[15],//国产/进口
            '附属设备或配置: ' + result[16],//附属设备或配置
            '使用状态: ' + result[17],//使用状态
            '备注: ' + result[18],//备注
          ],
          finishLoading: true
        })

  },

  // 查询历史
  searchHistroy:function(num){
    // console.log('s');
    var that = this
    var evalue = app.Encrypt()
    wx.request({
      url: 'https://www.stsidea.com/weixin.asmx/GetAssetCheckInfo',
      data: { 
        assetNo: num,
        evalue: evalue
       },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function(res) {
        that.endLoading()
        // ：为中文输入法
        var allInfo = res.data.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "").split('：')
        // console.log(allInfo)
        if(allInfo[0]=="成功"){
          
          var everyInfo = allInfo[1].split("|")
          // console.log(everyInfo)
           // 重组数据模型
          
          var tempArr = new Array();
          for (var i = 0; i < everyInfo.length; i++) {
            var result = everyInfo[i].split(",")
            // console.log(result)
            var info={
              time:result[4],
              person:result[3],
              place:result[1],
              state:result[2]
            }
            tempArr.push(info);
          }
          console.log(tempArr)
          that.setData({
            histroy_info:tempArr
          })

          // console.log(that.data.histroy_info)
        }else{
          that.showAlertMessage(allInfo[1])
        }
       

      },
      fail:function(res){
        that.endLoading()
        wx.showToast({
          title: '网络阻塞',
          duration: 0,
          mask: true,
        })
      },
      complete:function(res){
      }
      
    })
  },

  // 显示加载
  showLoading:function(){
      wx.showLoading({
        title: '正在加载',
        mask: false,
      })
  },

  // 隐藏加载
  endLoading:function(){
    wx.hideLoading();
  },
  // 显示提示信息
  showAlertMessage(msg) {
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
  }


  
})