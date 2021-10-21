const BASE_KEY = [
  'data',
  'onLoad',
  'onReady',
  'onShow',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onShareAppMessage',
]
const CAN_RUN_BASE_KEY = ["onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", "onShareAppMessage"]
const callbackMap = {}
let callbackId = 1
const maxCallbackId = 1 << 30

/**
 * 传入回调函数获得一个回调id，后面根据回调id运行回调函数
 * @param {*} callback 回调函数
 * @param {*} pageObj 绑定对象
 * @returns 
 */
function getCallbackId(callback, pageObj){
  if(typeof callback === "function"){
    // 上一个callbackid+1 
    const currentId = callbackId++
    callbackMap[currentId] = callback.bind(pageObj)
    if(callbackId > maxCallbackId){
      callbackId = 1
    }
    return currentId
  }
}
/**
 * 根据id找到回调函数并运行
 * @param {*} id 
 */
function runCallbackById(id){
  const callback = callbackMap[id]
  if(typeof callback === "function"){
    callback()
  }
}
/**
 * 获得一个传输数据对象
 * @param {*} data 渲染数据
 * @param {*} pageObj 页面对象
 * @param {*} callback 回调函数
 * @returns 
 */
function getSendMessageObj(data, pageObj, callback){
  const callbackId = getCallbackId(callback, pageObj)
  return {
    pageId: pageObj.id,
    data: data,
    callbackId
  }
}
// const page = {
//   onShow: function(){}
// } // 页面实例
function Page(pageObj){
  pageObj.id = +new Date()
  // console.log("pageObj", pageObj);
  // 收集去除基本属性的属性key列表
  Object.defineProperty(page, "eventHandler", {
    get: function(){
      return function(event){
        eventHandler.call(pageObj, event)
      }
    }
  })
  // 处理会运行的生命周期 onshow onhide 这些运行时会运行的
  CAN_RUN_BASE_KEY.map(key=>{
    // 暂存旧的生命周期
    const oldFunc = page[key]
    // 重写生命周期
    page[key] = function(){
      // 运行旧的生命周期
      if(typeof oldFunc === "function"){
        oldFunc.call(page)
      }
      // 运行新的生命周期
      if(typeof pageObj[key] === "function"){
        pageObj[key]()
      }
    }
  })
  // 初始化页面逻辑
  if(!pageObj.data){
    pageObj.data = {}
  }

  // 处理内部页面的setData
  pageObj.setData = function(obj = {}, callback){
    // console.log("inner page setData", obj);
    Object.keys(obj).map(key => {
      let nValue = obj[key]
      // TODO: 没有处理 'a.b.c': 777 的情况
      pageObj.data[key] = nValue
    })
    // 上面是先赋值给页面data，然后再传递数据给渲染层
    // 如果在页面还没有渲染就调用setData，丢弃，不处理，因为首次渲染会将全部data传递给渲染层
    if(pageObj.isRender){
      // 传递数据给渲染层，并设置渲染完成的回调
      pageObj.sendMessageToRender(obj, callback)
    }
  }

  /**
   * 发送数据给渲染层
   * @param {*} data 
   * @param {*} callback 
   */
  pageObj.sendMessageToRender = function(data, callback){
    // 向渲染层发送整个渲染data，并设置回调function
    const sendData = getSendMessageObj(data, pageObj, callback)
    pageObj.isRender = true
    typeof sendMessageToRender === "function" && sendMessageToRender(sendData)
  }

  /**
   * 首次渲染
   */
  pageObj.firstRender = function(){
    // 调用发送数据给渲染层
    pageObj.sendMessageToRender(pageObj.data, pageObj, firstRenderCallback)
  }

  // 处理不会运行的生命周期函数
  // 页面加载
  if(typeof pageObj.onLoad === "function"){
    // console.log("onLoad", page.options);
    pageObj.onLoad(page.options)
  }

  /** 首次渲染回调 */
  const firstRenderCallback = function(cb){
    console.log("firstRenderCallback");
    if(typeof cb === "function"){å
      cb.call(pageObj)
    }
    // 页面渲染完成
    if(typeof pageObj.onReady === "function"){
      pageObj.onReady()
    }

    // 页面渲染完成
    if(typeof pageObj.onShow === "function"){
      pageObj.onShow()
    }
    wx.hideLoading({})
  }
  // 设定标记 是已经渲染了
  pageObj.firstRender()
}