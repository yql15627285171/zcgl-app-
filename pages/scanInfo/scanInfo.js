// scanInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:'',  //要显示操作的设备编号
    result:[],//请求回来的结果
    details_info:[],
    // 地点
    place:"",
    place_info: [
      'ATB1F1',
      'ATB1F2',
      'ATB1F3',
      'ATB1F4',
      'ATB1F5',
      'ATB2F1',
      'ATB2F2',
      'ATB2F3',
      'ATB2F4',
      'ATB2F5',
      'LTB1F1',
      'LTB1F2',
      'LTB1F3',
      'LTB1F4',
      'LTB1F5',
      'LTB1F6',
      'FYB1F1',
      'FYB1F2',
      'FYB1F3',
      'FYB1F4',
      'FYB1F5',
      'FYB2F1',
      'FYB2F2',
      'FYB2F3',
      'FYB2F4',
      'FYB2F5',
      'FYB3F1',
      'FYB3F2',
      'FYB3F3',
      'FYB3F4',
      'FYB3F5',
      ],
    // 状态
    state:"",
    state_info:['在用','在用无折旧','在用有折旧','在用外借','废弃'],
    // 负责人
    person:'',
    // 弹出层背景的控制
    showBG:false,
    // 弹出层控制
    showPlace: false,
    // 拍照后存放临时文件的路径
    picUrl:"",
    //判断是否网络请求完毕
    finishLoad:false,
    // 是否有进行拍照
    is_takePhoto:false,
    // 上传按钮能否点击
    notPress:false,
    // 负责人输入框获取焦点
    peronFocus:false,
    showDefaultPic:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //进行网络请求操作
    this.setData({
      num: options.num
    })
    this.showLoading()
    this.requestEquiment(options.num)
    this.downloadImage(options.num)
  },

  //查询设备信息 
  requestEquiment:function(num){
    var that = this
    var evalue = app.Encrypt()
    wx.request({
      url: 'https://www.stsidea.com/weixin.asmx/GetAssetInfo',
      data: { 
        assetNo: num ,
        evalue: evalue
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        that.endLoading("加载成功");
        // 将结果变成数组
        var result = res.data.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "").split(",")
        console.log(result);

        if(result.length==1){
          // 扫描没有结果的时候
          wx.showModal({
            title: '提示',
            content: '不存在改设备',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        }else{
          that.setData({
            finishLoad: true,
            result: result,
            place: '存档地点: ' + result[13],//存档地点
            state: '使用状态: ' + result[17],//使用状态
            person: result[10],//负责人
            details_info: [
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
              // '负责人: ' + result[10],//负责人            
              '当前中心: ' + result[11],//当前中心
              '使用部门: ' + result[12],//部门
              '生产厂家:  ' + result[14],//生产厂家
              '国产/进口: ' + result[15],//国产/进口
              '附属设备或配置: ' + result[16],//附属设备或配置
              '备注: ' + result[18],//备注
            ],

          })
        }


      },
      fail:function(res){
        that.endLoading('服务器阻塞，请下拉刷新')
      }
    })
  },

  // 下载设备图片
  downloadImage:function(num){
    var that = this
     wx.downloadFile({
       url: 'https://www.stsidea.com/Images/'+num+'.jpg',
      
       success: function(res) {
         console.log(res)
         if (res.statusCode == 200){
           console.log(res.tempFilePath)
           that.setData({
             picUrl: res.tempFilePath,
             showDefaultPic:false
           })
         }
        
       },
       fail: function(res) {
         that.endLoading('图片加载失败，请下拉刷新')
       },
       complete: function(res) {
         wx.stopPullDownRefresh()
       },
     })
  },


  // 修改状态
  choiceState:function(event){
    var that = this;
    wx.showActionSheet({
      itemList: that.data.state_info,
      success: function (res) { 
        //返回显示
        if (res.tapIndex || res.tapIndex == 0){
          that.changeData(false, res.tapIndex);
        }
      }
    })

  },

  // 修改地点
  choicePlace: function (event) {
    var index = event.currentTarget.dataset.index;
    if(index||index==0){
      this.changeData(true,index);
    }
    this.disappear();
  },

  // 修改数据
  changeData:function(type,index){
    var result= this.data.result
    
    if(type){
        // 地点
       result[13] = this.data.place_info[index]
        this.setData({
          result:result,
          place: '存档地点: ' + result[13],
        })
     
    }else{
      // 状态
      result[17] = this.data.state_info[index]
      this.setData({
        result:result,
        state: '使用状态: ' + result[17],
      })

    }

  },
 
//  显示或隐藏地址选项
  showAlert:function(){
    this.setData({
      showBG: true,
      showPlace: true
    })
  },

  disappear:function(){
    this.setData({
      showBG:false,
      showPlace:false
    })
  },

  //拍照
  takePhoto: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function (res) {
        that.setData({
          is_takePhoto:true,
          picUrl: res.tempFilePaths[0],
          showDefaultPic:false
        })

      },

    })
  },



  // 确定上传
  sureUpload:function(){
    var that = this

    var evalue = app.Encrypt()
    console.log(typeof (evalue))
    var num = this.data.num;

    var user = wx.getStorageSync('user')

    var param = {
      assetNo: num,
      place: this.data.result[13],
      state: this.data.result[17],
      keeperName: this.data.person,
      currentUser: user,
      evalue: evalue
      
    }
    console.log(param)
    // 上传设备信息
   wx.request({
     url: 'https://www.stsidea.com/weixin.asmx/UpdateAssetCheckInfo',
     data: param,
     header: { 'content-type': 'application/x-www-form-urlencoded'},
     method: 'POST',
     success: function(res) {
      //  没有拍照的时候用这来判断上传是否成功
       if (!that.data.is_takePhoto){
         var result = res.data.replace(/<[^>]+>/g, "").replace(/[\r\n]/g, "")
        //  console.log(result);
         if (result == "成功") {
           that.endLoading("上传成功")
         } else {
           that.endLoading("上传失败")
         }
       }

     },
     fail:function(res){
       that.endLoading("网络阻塞，上传失败")
     }

   })
  //   // 上传图片
   var evalue = app.Encrypt()
  
    if(that.data.is_takePhoto){
      this.setData({
        notPress: true,
      })
      wx.uploadFile({
        url: 'https://www.stsidea.com/weixin.asmx/SaveImage',
        filePath: that.data.picUrl,
        name: num + '$' + evalue,
        success: function(res) {
          console.log(res.data)
          if(res.data.indexOf("成功") != -1){
            that.endLoading("上传成功")
          }else{
            that.endLoading("信息上传成功，图片上传失败")
          }
          
          
        },
        fail: function(res) {
          that.endLoading("网络阻塞,信息上传成功，图片上传失败")
        },
        complete: function(res) {
          that.setData({
            notPress: false,
          })
        },
      })
    }


  },

  // 获取

  // 获取焦点
  getFocus:function(){
    this.setData({
      peronFocus:true
    })
  },
  // 负责人改变
  valueOfPersonChange(e) {
    this.setData({
      person: e.detail.value.trim()
    })
  },
  // 显示加载
  showLoading: function () {
    wx.showLoading({
      title: '正在加载',
    })
  },

  // 隐藏加载
  endLoading: function (msg) {
    wx.hideLoading();
    wx.showToast({
      title: msg,
      duration: 1000,
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("刷新")
    // 下拉刷新，重新登录一次，
    this.showLoading()
    this.setData({
      // 是否有进行拍照
      is_takePhoto: false,
      // 上传按钮能否点击
      notPress: false,
    })
    this.requestEquiment(this.data.num)
    this.downloadImage(this.data.num)

  },





})