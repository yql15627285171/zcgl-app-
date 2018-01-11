/**
 * 本文件是网络请求的统一封装
 */

/**
 * 所用接口统一的baseURL
 */
const baseURL = "https://www.stsidea.com/weixin.asmx"

/**
 * get请求与post请求
 * url:相对路径
 * params:参数
 * requestHandler：一个包含回调函数的对象
 */

function GET(url,params,requestHandler){
  request("GET", url, params, requestHandler)
}

function POST(url,params,requestHandler){

  request("POST", url, params,requestHandler)
}

function request(method, url, params, requestHandler) {
  /**
   * 这里可以对参数进行加密处理（暂时忽略）
   */



 /**
  * 重组完整的URL
  */
  var API_URL = baseURL + url
  
/**
 * 惊醒网络请求，这里可以显示loading
 */


  wx.request({
    url: API_URL,
    data: params,
    method: method, 
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res)
    },
    fail: function (res) {
      requestHandler.fail(res)
    },
    complete: function () {
      /**
       * 结束loading
       */
    }
  })
}

/**
 * 暴露外调接口
 */
module.exports = {
  GET: GET,
  POST: POST
}
