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
// const page = {
//   onShow: function(){}
// } // 页面实例
function Page(pageObj){
  // console.log("pageObj", pageObj);
  // 收集去除基本属性的属性key列表
  const keys = Object.keys(pageObj).filter((key)=>{
    return BASE_KEY.indexOf(key) === -1
  })
  Object.defineProperty(page, "eventHandler", {
    get: function(){
      return function(event){
        eventHandler.call(pageObj, event)
      }
    }
  })
  // console.log("keys", keys);
  // 将这些属性对应的函数绑定给真正的页面实例 以便触发
  keys.map(key=>{
    const value = pageObj[key]
    // console.log("key isfunction", key, typeof value === "function");
    if(typeof value === "function"){
      // 绑定页面方法给到this
      pageObj[key] = value.bind(pageObj)
      Object.defineProperty(page, key, {
        get: function(){
          return function(){
            // console.log("执行了defineProperty 的 key 方法", key);
            const args = Array.prototype.slice.call(arguments);
            value.apply(pageObj, args)
          }
        }
      })
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
  let preData = undefined
  let preRenderTime = 0;
  const throttleTime = 0
  let timer
  let callbackList = []
  // 执行callback 列表
  function runCallBackList(){
    for(let i=0; i< callbackList.length; i++){
      const callback = callbackList[i]
      if(callback && typeof callback === "function"){
        callback.call(pageObj)
      }
    }
  }
  if(!pageObj.data){
    pageObj.data = {}
  }
  bindRealData(pageObj.data)
  // 给页面增加页面渲染函数
  pageObj.render = function(callback){
    const now = +new Date()
    // console.log("preRender relative", now - preRenderTime);
    preRenderTime = now
    // 加个节流 
    if(timer){
      // 存在callback
      if(callback){
        callbackList.push(callback)
      }
      return
    }
    callbackList = [callback]
    const that = this
    timer = true
    Promise.resolve().then(res => {
      console.log("real render", +new Date() - now, throttleTime);
      that._render(runCallBackList)
      timer = undefined
      callbackList = []
    })

  }

  pageObj._render = function(callback) {
    let pre = +new Date()
    let isFirstRender = !this._hasRender
    let vdoms = renderFunction(renderProxyData, isFirstRender) || {};
    const renderDiffTime = +new Date() - pre
    console.log("renderFuntion", renderDiffTime)
    if(isFirstRender){
      // 如果是首次渲染的话
      this._hasRender = true
      page.setData({
        [vdomsKey]: vdoms
      }, firstRenderCallback(callback))
    }else{
      // 如果是再次渲染
      page.setData(vdoms, callback)
    }
  }

  // 处理内部页面的setData
  pageObj.setData = function(obj = {}, callback){
    // console.log("inner page setData", obj);
    Object.keys(obj).map(key => {
      let nValue = obj[key]
      // 不会影响页面渲染的数据 直接挂在到data
      if(dataKeys.indexOf(key) === -1){
        realData[key] = nValue
        return
      }
      // 如果是对象 并且和元数据相同
      if(nValue && typeof nValue === "object"){
        nValue = JSON.parse(JSON.stringify(nValue))
      }
      // TODO: 没有处理 'a.b.c': 777 的情况
      renderProxyData[key] = nValue
      // if(key.indexOf(".") === -1 && key.indexOf("[") === -1){
      // }
    })
    this.render(callback)
  }

  // 处理不会运行的生命周期函数
  // 页面加载
  if(typeof pageObj.onLoad === "function"){
    // console.log("onLoad", page.options);
    pageObj.onLoad(page.options)
  }

  /** 首次渲染回调 */
  const firstRenderCallback = function(cb){
    return function(){
      console.log("firstRenderCallback");
      if(typeof cb === "function"){
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
  }
  pageObj.render()
}

/**
 * 判断两个对象是否有变化 没变化会返回false
 * @param {*} oldData 旧数据
 * @param {*} newData 新数据
 * @returns 没有变化 变化后的修改逻辑
 */
 function diff(oldData, newData){
  // console.log("oldData", oldData, newData);

  // 首先判断数据类型
  if(typeof oldData !== "object" || typeof newData !== "object"){
    // 不是对象 都不处理
    return newData
  }
  // console.log("111");
  
  // 判断是不是数组
  const isArrayOld = Array.isArray(oldData)
  const isArrayNew = Array.isArray(newData)
  if(isArrayOld !== isArrayNew){
    return newData
  }
  // 判断是否有修改
  let hasChange = false
  // 修改后的属性
  const modifyData = isArrayOld ? [] : {}
  if(false){
    // console.log("isArray", oldData, newData);
    // // 数组的情况 []
    // const oldLen = oldData.length
    // const newLen = newData.length
    // for(let i=0; i<newLen; i++){
      
    // }
  }else{
    // console.log("isObject", oldData, newData);
    // 对象的情况 {}
    // 对比对象的值是否一致
    const oldKeys = Object.keys(oldData) || []
    const newKeys = Object.keys(newData) || []
    newKeys.map(key=>{
      // 判断在就节点上是否存在值
      const oldIndex = oldKeys.indexOf(key)
      // 存在 旧值
      const newValue = newData[key]
      const oldValue = oldData[key]
      if(oldIndex < 0){
        // 不存在
        modifyData[key] = newValue
        hasChange = true
      } else {
        oldKeys.splice(oldIndex, 1)
        // 先判断是什么类型， 如果是基本类型则当场判断
        if(typeof newValue != "object"){
          // 不等才需要处理 相等则不处理
          if(oldValue !== newValue){
            modifyData[key] = newValue
            hasChange = true
          }
        }else{
          // 新属性是对象 则递归遍历
          const childHasChange = diff(oldValue, newValue)
          if(childHasChange){
            hasChange = true
            const keys = Object.keys(childHasChange) || []
            const childIsArray = Array.isArray(oldValue)
            keys.map(childKey=>{
              modifyData[`${connectKeyByIsArray(childIsArray, key,childKey)}`] = childHasChange[childKey]
            })
          }
        }
      }
    })
    // console.log("oldKeys", oldKeys)
    oldKeys.map(key => {
      const isObject = typeof oldData[key] === "object"
      modifyData[key] = isObject ? {} : ""
      hasChange = true
    })
  }
  if(!hasChange){
    return false
  }
  return modifyData
}

/**
 * 连接两个字符
 * @param {*} isArray 
 * @param {*} key 
 * @returns 
 */
 function connectKeyByIsArray(isArray, prekey,  childKey){
  if(!isArray){
    return`${prekey}.${childKey}`
  }
  const isContainDot = childKey.indexOf(".") // 0.xxx
  // console.log("res", isContainDot)
  if(isContainDot > 0){
    //  => [0].
    childKey = childKey.slice(0,isContainDot) + "]" +childKey.slice(isContainDot)
  }else{
    childKey = childKey+"]"
  }
  return `${prekey}[${childKey}`
}