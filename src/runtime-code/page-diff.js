/**
 * 找到渲染树的最小化变更
 */
const isProd = true
const childrenKey = isProd ? "_a" : "children"
const contentKey = isProd ? "_b" : "content"
const tagNameKey = isProd ? "_c" :  "tagName"
const attributesKey = isProd ? "_d":  "attributes"
const vdomsKey = isProd ? "_e":  "vdoms"
/**
 * 属性依赖类
 */
 class Dep {
    constructor(dataKey = ""){
        this.dataKey = dataKey
        this.keyNodeList = []
        this._keyList = []
    }
    addTempKey(keyList){
        if(!keyList || !Array.isArray(keyList)){
            console.error("addTempKey 不是数组");
            return
        }
        // 保存依赖关系 哪个节点 哪个key 还有可能是层级嵌套
        // const oneFloorKeyNodeList = []
        keyList.map((key, index)=>{
            const node = currentTreeNodes[index]
            const onlyKey = "" + node.id + "_" + key
            if(this._keyList.indexOf(onlyKey) >= 0 ){
                return
            }
            
            this._keyList.push(onlyKey)
            this.keyNodeList.push({
                key,
                node,
                floor: index,
            })
        })
    }
    notify(startFloor = 0){
        // console.log("this._keyList", this.dataKey, this._keyList);
        // 告诉节点要更新节点的这些属性
        // 遍历属性节点列表，告诉节点对应的属性需要更新
        this.keyNodeList.map(item =>{
            const {key, node, floor} = item || {}
            // 如果是低层级的 少于高层级的节点 则不通知更新
            if(floor < startFloor){
                return
            }
            if(!node || !key){
                console.error("遍历属性节点列表，出错 没有属性或节点值");
                return
            }
            if(!node.nextUpdateKeyList){
                node.nextUpdateKeyList = []
            }
            const index = node.nextUpdateKeyList.indexOf(key)
            if(index >= 0 ){
                // 已经将属性加到更新列表
                return
            }
            node.nextUpdateKeyList.push(key)
        })

    }
}
// 当前节点树列表
const currentTreeNodes = []
/**
 * 增加节点到当前节点列表
 * @param {*} node 
 */
function addCurrentTreeNodes(node){
    // console.log("addCurrentTreeNodes", node);
    if(node && currentTreeNodes.indexOf(node) === -1){
        currentTreeNodes.push(node)
    }
}
/**
 * 从节点列表移除节点
 * @param {*} node 
 * @returns 
 */
function removeCurrentTreeNodes(node){
    if(!node){
        return
    }
    const index = currentTreeNodes.indexOf(node)
    if(index >= 0){
        currentTreeNodes.splice(index, 1)
    }
}
/**
 * 输出当前节点列表
 */
function logCurrentTreeNodes(){
    // console.log("currentTreeNodes", currentTreeNodes)
}
function NullNode(){}
NullNode.prototype.__null__ = true
const nullNode =  new NullNode()

/**
 * 绑定初次渲染函数以及更新函数
 * @param {*} template 
 * @returns 
 */
function addFirstAndUpdateRender(template){
    if(typeof template !== "object"){
        //  console.log("addFirstAndUpdateRender传入数据有问题")
        return
    }
    template.firstRender = firstRender.bind(template)
    template.updateRender = updateRender.bind(template)
}

function bindRealData(_realData){
    realData = _realData
}

/**
 * 首次根据渲染数据构造渲染数据
 * @param {*} data 
 * @returns 渲染树
 */
function firstRender(data, id = 0) {
    if(!this.nodeList){
        this.nodeList = []
    }
    if(!this.nodeList[id]){
        this.nodeList[id] = {}
    }
    const treeNode = this.nodeList[id]
    // 把节点树加到节点树列表
    addCurrentTreeNodes(treeNode)
    const updateTemplate = {}
    let domTree = []
    if(Array.isArray(this.firstTemplate)){
        // 如果是数组 则用数组的遍历方式
        domTree = walkTemplateList(this.firstTemplate, data, updateTemplate, this.prekey)
    }else{
        // 如果是单个节点 则用遍历单个节点的方式 
        domTree = walkTemplate(this.firstTemplate, data, undefined, updateTemplate, this.prekey, id)
    }
    // console.log("updateTemplate", updateTemplate);
    // 暂存更新模板
    treeNode.updateTemplate = updateTemplate
    // 将节点从当前遍历节点列表中移除
    removeCurrentTreeNodes(treeNode)
    // 初始化下一次渲染key 为空数组
    treeNode.nextUpdateKeyList = []
    return domTree
}
/**
 * 更新对象
 * @param {*} isRoot 
 */
function UpdateObject(isRoot = false){
  this.isRoot = isRoot
  this.resultArray = []
  this.resultObj = {}
}
/**
 * 获取结果
 * @returns 
 */
UpdateObject.prototype.getValue = function(){
  if(this.isRoot){
      return this.resultObj
  }
  return this.resultArray
}
/**
 * 获取数组的值
 * @returns 
 */
UpdateObject.prototype.getArrayValue= function(){
  return this.resultArray
}
/**
 * 获取对象的值
 * @returns 
 */
UpdateObject.prototype.getObjValue= function(){
  return this.resultObj
}

/**
 * 增加变化的属性和对应的值
 * @param {*} key 
 * @param {*} value 
 */
UpdateObject.prototype.add = function(key, value){
  this.resultObj[key] = value
  this.resultArray.push({
      key,
      value
  })
}
/**
 * 更新对象的变化值
 */
UpdateObject.prototype.__update__ = true
/**
  * 再次渲染
  * @param {*} data 渲染数据
  * @returns 变化的对象
  */
function updateRender(data, id = 0, isRoot = false, isCheckAllChage = false){
    // 获取当前的节点
    const treeNode = this.nodeList[id]
    // 把节点树加到节点树列表
    addCurrentTreeNodes(treeNode)
    // 拿到更新的updateTemplate
    const updateTemplate = treeNode.updateTemplate
    const updateResult = new UpdateObject(isRoot)
    // console.log("treeNode.nextUpdateKeyList", treeNode.nextUpdateKeyList);
    if(isCheckAllChage){
        if(!treeNode.allKeys){
            treeNode.allKeys = Object.keys(updateTemplate)
        }
        treeNode.keys = treeNode.allKeys
    }else{
        treeNode.keys = treeNode.nextUpdateKeyList || []
    }
    treeNode.nextUpdateKeyList = []

    // console.log("nextUpdateKeyList", id, treeNode.keys);
    
    treeNode.keys.map(key=>{
        const changeNode = updateTemplate[key]
        //  console.log("changeNode", changeNode);
        const {pre, render} = changeNode || {}
        // console.log("updateRender key", key);
        if(typeof render !== "function"){
            //  console.log("重新渲染数据不是变化的")
            return
        }
        tempKeyList.push(key)
        // 重新渲染的数据
        const nextRenderValue = render(data)
        tempKeyList.pop()
        //  console.log("nextRenderValue", nextRenderValue);
        // 判断是不是wxif的节点
        if(changeNode.isWxIf){
            // 如果是首次放开 则直接修改整个对象
            if(pre.__null__ && !nextRenderValue.__null__){
                // updateResult[key] = nextRenderValue
                updateResult.add(key, nextRenderValue)
                changeNode.pre = nextRenderValue
            }
            // 如果是更新
            else if (!pre.__null__ && nextRenderValue.__update__){
                // 子节点也是更新 那就拼接字符串
                nextRenderValue.getArrayValue().map(item => {
                    const childKey = item.key 
                    // 拼接当前key 和 子节点key
                    // updateResult[keyJoin(key, childKey)] = nextRenderValue[childKey]
                    updateResult.add(keyJoin(key, childKey), item.value)
                })
            }
            // 如果原本是显示，后面隐藏
            else if (!pre.__null__ && nextRenderValue.__null__){
                // updateResult[key] = nextRenderValue
                updateResult.add(key, nextRenderValue)
                changeNode.pre = nextRenderValue
            }
            // 如果原本是隐藏 后面还是隐藏 不处理
        // 判断是不是wxFor节点
        } else if(changeNode.isWxFor){
            // //  console.log("isWxFor changeNode nextRenderValue", nextRenderValue);
            if(!nextRenderValue.__update__){
                // 不是更新节点的情况 
                console.error("wxfor 再次渲染函数得到的结果不是 更新节点");
                return
            }
            nextRenderValue.getArrayValue().map(item=>{
                const childKey = item.key
                const realChildKey = keyJoin(key, childKey, true)
                // 判断是直接更新对象还是更新对象属性
                const nextChildRenderValue = item.value
                if(nextChildRenderValue.__update__){
                    // 如果也是更新属性
                    nextChildRenderValue.getArrayValue().map(grandsonItem => {
                        const grandsonKey = grandsonItem.key
                        // 拼接前面的key和孙key 
                        const realGrandsonKey = keyJoin(realChildKey, grandsonKey)
                        // updateResult[realGrandsonKey] = nextChildRenderValue[grandsonKey]
                        updateResult.add(realGrandsonKey, grandsonItem.value)
                    })
                }else{
                    // updateResult[realChildKey] = nextChildRenderValue
                    updateResult.add(realChildKey, nextChildRenderValue)
                }
                
            })
        } else {
            // 判断和原本结果是否一致，如果不一致则更新
            // TODO: 判断对象的变化
            const isChange = judgeHasChage(pre, nextRenderValue)
            // console.log("isChange", key, isChange, pre, nextRenderValue, data, real);
            if(isChange){
                // updateResult[key] = nextRenderValue
                updateResult.add(key, nextRenderValue)
                changeNode.pre = nextRenderValue
            }
        }
    })
    removeCurrentTreeNodes(treeNode)
    return updateResult
}
/**
 * 判断对象是否有改变
 * @param {*} pre 
 * @param {*} next 
 * @returns 
 */
function judgeHasChage(pre, next){
    // 判断类型
    if(pre !== next){
        return true
    }
}
/**
 * 遍历模板列表
 * @param {*} templateList 模板列表
 * @param {*} data 渲染数据
 * @param {*} updateTemplate 更新模板
 * @param {*} prekey 前一个节点的key
 * @returns 
 */
function walkTemplateList(templateList, data, updateTemplate = {}, prekey = ""){
    let result = []
    if(!templateList){
        return result
    }
    //  console.log("templateList", templateList);
    // 参数判断
    if(!Array.isArray(templateList)){
        //  console.log("templateList不是列表")
        return result
    }
    let wxForListLen = 0;
    let preTemplate 
    // 开始遍历
    for(let i=0; i < templateList.length; i++){
        const template = templateList[i]
        if(template.wxFor){
            // 如果是wxfor 把wxfor 节点 和后面的节点组装到一块
            const vdoms = walkTemplate(template, data, preTemplate, updateTemplate, prekey, i)
            result = result.concat(vdoms)
            wxForListLen += vdoms.length - 1
        }else{
            const tempKey = keyJoin(prekey, i+wxForListLen, true)
            const vdom = walkTemplate(template, data, preTemplate, updateTemplate, tempKey)
            result.push(vdom)
        }
        preTemplate = template
    }
    //  console.log("result.length", result.length);
    return result
}
/**
 * 组合前后节点key
 * @param {*} pre 
 * @param {*} next 
 * @param {*} isArray 
 * @returns 
 */
function keyJoin(pre, next, isArray = false){
    if(isArray){
        if(!pre){
             console.log("key 拼接出错 数组没有前面的key");
        }
        return pre ? (pre + "[" + next+"]") : next
    }else{
        return pre ? (pre + "." + next) : next
    }
}
/**
 * 遍历单个节点
 * @param {*} template 单个节点的渲染模板
 * @param {*} data 数据
 * @param {*} preTemplate 前一个节点的渲染模板
 * @param {*} updateTemplate 更新模板
 * @param {*} prekey 前一个属性的key
 */
function walkTemplate(template, data, preTemplate, updateTemplate = {}, prekey = "", startIndex = 0){
    //  console.log("template", template);
    // 判断是不是 wxIf 节点
    if(template.wxIf || template.wxElif || template.wxElse){
        const templateNode = handleTemplate2Node(template, preTemplate)
        const renderFunc = getWxIfRenderFuncTemplateById(templateNode)
        tempKeyList.push(prekey)
        const result = renderFunc(data)
        updateTemplate[prekey] = {
            isWxIf: true,
            pre: result,
            render: renderFunc
        }
        tempKeyList.pop()
        return result
    }
    // 判断是不是 wxFor 节点
    if(typeof template.wxFor !== "undefined"){
        // 构建一个wxFor的节点
        const templateNode = handleTemplate2Node(template)
        const renderFunc = getWxForRenderFuncTemplateById(templateNode, startIndex)
        tempKeyList.push(prekey)
        const result = renderFunc(data, true)
        updateTemplate[prekey] = {
            isWxFor: true,
            pre: result,
            render: renderFunc 
        }
        tempKeyList.pop()
        return result
    }
    // 下面是静态节点的处理
    const vdom = {
        [tagNameKey]: template[tagNameKey] || template._tag || template.tag || template.tagName,
    }
    if(template[contentKey]){
        /**
         * {
         *   tag: "text",
         *   content: function(){}
         * }
         */
        const key = contentKey
        let value = template[contentKey]
        if(typeof value === "function"){
            const realKey = keyJoin(prekey, key)
            tempKeyList.push(realKey)
            const result = value(data)
            updateTemplate[realKey] = {
                pre: result,
                render: value
            }
            value = result
            tempKeyList.pop()
        }
        vdom[key] = value
        return vdom
    }
    vdom.uid = template.uid,
    vdom.key = template.uid+"_"+startIndex
    // 遍历属性
    const attributes = template[attributesKey] || []
    for(let i=0; i< attributes.length; i++){
        const attribute = attributes[i]
        const key = attribute.key
        let value = attribute.value;
        // 如果值是一个方法 需要计算得出 则是属于可变化内容
        if(typeof value === "function"){
            // 加入变化范围
            const realKey = keyJoin(prekey, key)
            tempKeyList.push(realKey)
            const result = value(data)
            updateTemplate[realKey] = {
                pre: result,
                render: value
            }
            value = result
            tempKeyList.pop()
        }
        vdom[key] = value
    }
    // 遍历dataSet
    const dataSet = template.dataSet
    if(typeof dataSet === "object"){
        vdom.dataSet = {}
        const dataSetPreKey = keyJoin(prekey, "dataSet")
        Object.keys(dataSet).map((key)=>{
            let value = dataSet[key]
            // console.log("dataSet add update", key, value);
            // 如果值是一个方法 需要计算得出 则是属于可变化内容
            if(typeof value === "function"){
                // 加入变化范围
                const realKey = keyJoin(dataSetPreKey, key)
                // console.log("dataSetPreKey realKey", realKey);
                tempKeyList.push(realKey)
                const result = value(data)
                updateTemplate[realKey] = {
                    pre: result,
                    render: value
                }
                value = result
                tempKeyList.pop()
            }
            vdom.dataSet[key] = value
        })
    }

    // 遍历children
    let children = template[childrenKey]
    /**
     * {
     *  tag: "view"
     *  children: [
     *      {}
     *  ]
     * }
     */
    prekey = keyJoin(prekey, childrenKey)
    vdom[childrenKey] = walkTemplateList(children, data, updateTemplate, prekey)

    return vdom
}

/**
 * 将原生template组装成一个渲染节点，抽离渲染出模板，和wxif wxfor 的控制逻辑
 * @param {*} template 
 * @param {*} preTemplate 
 * @returns 
 */
function handleTemplate2Node(template, preTemplate){
    const {wxIf, wxElif, wxElse, wxFor, wxForIndex, wxForItem, wxForVarNameList, ...firstTemplate} = template
    let currentWxIf = wxIf
    if(!wxIf && (wxElif || wxElse)){
        currentWxIf = function(...args){
            if(wxIf){
                return wxIf(...args)
            }else if(wxElif){
                return !preTemplate.wxIf(...args) && wxElif(...args)
            }else{
                return !preTemplate.wxIf(...args)
            }
        }
        template.wxIf = currentWxIf
    }
    return {
        id: templateId++,
        wxIf: currentWxIf,
        wxElif,
        wxElse,
        wxFor,
        wxForIndex,
        wxForItem,
        firstRender,
        firstTemplate,
        wxForVarNameList,
        updateRender
    }
}

function getTemplateById(id){
    return templateVdom[id] || {}
}

/**
 * 根据wxIfId 找到对应的模板 并返回一个构建函数，执行之后会返回一颗节点数或
 * @param {*} wxIfId 
 * @returns 渲染dom树 或者节点数
 */
function getWxIfRenderFuncTemplateById(template){
    return function(data){
        // 判断是否需要展示
        let wxIf = false;
        if(typeof template.wxIf !== "undefined"){
            // console.log("getWxIfRenderFuncTemplateById wxIf", template);
            wxIf = typeof template.wxIf === "function" ? template.wxIf(data) : !!template.wxIf 
        }
        // //  console.log("wxIf", wxIf);
        let result = new NullNode()
        // 如果之前是隐藏 现在是展示
        if(!template.preWxIf && wxIf){
            // 执行首次渲染的逻辑
            // console.log("执行首次渲染的逻辑");
            result = template.firstRender(data)
        // 之前是展示，现在也是展示
        }else if( template.preWxIf && wxIf){
            // console.log("template.preWxIf && wxIf updateRender", template);
            result = template.updateRender(data)
            // result.__update__ = true
        // 之前是展示 现在是隐藏
        }else if(template.preWxIf && !wxIf){
            // result = {}
        // 之前是隐藏 现在还是隐藏
        } else {
            // result = {}
        }
        // 将这次的状态设置为上一次的状态
        template.preWxIf = wxIf
        return result
    }
}

/**
 * 增加渲染数据的监听
 * @param {*} data 需要监听的数据对象
 * @param {*} keys key列表
 * @param {*} wxForVarNameList key属性如果是对象的话，对应的属性列表 [{key: "item", secondKeyList: ["value"]}]
 */
function addObserver(data, keys, wxForVarNameList){
    if(!Array.isArray(keys)){
        console.error("addObserver keys not array")
        return
    }
    const targetData = {}
    // 只通知 后面层级的更新 不通知前面层级更新
    const startFloor = currentTreeNodes.length;
    // 如果在编译层收集了item 对应的属性
    if(Array.isArray(wxForVarNameList) && wxForVarNameList.length > 0){
        wxForVarNameList.map((item) => {
            const {key, secondKeyList} = item
            if(!key){
                console.warn("observer key is undefined");
                return
            }
            // 构建首层的监听 item.value 或 item ==> 构建item的监听
            const dep = new Dep()
            let hasSecondKeyList = Array.isArray(secondKeyList)  && secondKeyList.length > 0
            let childData = data[key] // data["item"] = { title: "", tip = {}}
            let childProxyData = {}
            Object.defineProperty(targetData, key, {
                get: function(){
                    // 保存映射关系
                    dep.addTempKey(tempKeyList)
                    // 获取结果
                    return childData
                },
                set: function(newValue){
                    // 如果值没发生变化 并且是没有子属性
                    if(!hasSecondKeyList && newValue === childData){
                        return
                    }
                    // 先通知子节点的属性变化，子节点的属性通过childData[key] 取值，如果先设置了 childData = newValue 则无法知道哪个有更新
                    if(typeof newValue === "object" && hasSecondKeyList){
                        secondKeyList.map((secondKey) => {
                            // console.log("childProxyData", secondKey, childProxyData[secondKey], newValue[secondKey]);
                            childProxyData[secondKey] = newValue[secondKey]
                        })
                    }
                    // 保存结果
                    childData = newValue
                    // 通知对应的属性更新
                    dep.notify(startFloor)
                }
            })

            // 如果没有第二层属性 则不需要监听第二层属性
            if(hasSecondKeyList){
                // 监听修改过的变量名
                Object.defineProperty(targetData, "_"+key, {
                    get: function(){
                        // 获取结果
                        return childProxyData
                    }
                })
                // ["value", "id", "tip"]
                secondKeyList.map(secondKey => {
                    const childDep = new Dep()
                    Object.defineProperty(childProxyData, secondKey, {
                        get: function(){
                            // 保存映射关系
                            childDep.addTempKey(tempKeyList)
                            // 如果不是元数据对象的话 就返回undefined
                            if(typeof childData !== "object"){
                                return undefined
                            }
                            // 获取结果
                            return childData[secondKey]
                        },
                        set: function(newValue){
                            // 如果不是元数据对象的话 就直接返回 不存在这样的情况
                            if(typeof childData !== "object"){
                                return
                            }
                            // 如果值没发生变化
                            if(newValue === childData[secondKey]){
                                return
                            }
                            // console.log("第二层数据有更新", key, secondKey);
                            // 不需要保存结果 因为这个结果都是从childData取出来的 这个set 只是为了通知更新
                            // childData[secondKey] = newValue
                            // 通知对应的属性更新
                            childDep.notify(startFloor)
                        }
                    })
                })
            }
        })
    }else{
        // 如果没有wxForVarNameList
        keys.map((key)=>{
            const dep = new Dep()
            Object.defineProperty(targetData, key, {
                get: function(){
                    // 保存映射关系
                    dep.addTempKey(tempKeyList)
                    // 获取结果
                    return data[key]
                },
                set: function(newValue){
                    // 如果值没发生变化
                    if(newValue === data[key]){
                        return
                    }
                    // 保存结果
                    data[key] = newValue
                    // 通知对应的属性更新
                    dep.notify(startFloor)
                }
            })
        })
    }
    return targetData
}

/**
 * 分割字符
 * @param {*} key 
 */
function splitKey(key){
    const result = []
    let oneKey = ""
    for(let i=0; i<key.length; i++){
        const currentChar = key[i]
        if(currentChar === "." || currentChar === "[" || currentChar === "]"){
            if(oneKey){
                // 存在key 才加入 如果是[1]. 的情况就会onekey为空
                result.push(oneKey)
            }
            oneKey = ""
        }else{
            oneKey += currentChar
        }
    }
    if(oneKey){
        result.push(oneKey)
    }
    return result
}

/**
 * 结合更新的属性到第一次渲染的数据上
 * @param {*} firstVdom 
 * @param {*} updateVdom 
 */
function combineFirstVdomAndUpdateVdom(firstVdom, updateVdom){
    // console.log("firstVdom", JSON.stringify(firstVdom, null, 2));
    // console.log("updateVdom", JSON.stringify(updateVdom, null, 2));
    updateVdom.getArrayValue().map(({key, value})=>{
        // console.log("key, value", key, value);
        // key = "a.b[1].d"
        // value = 1 || "xss" || {}
        // 分割key 拿到key 的列表
        const keys = splitKey(key) || []
        console.log("firstVdom", firstVdom);
        // 拿到最后一个设置的key 比如说 a.b[1].d" 的 d
        const endKey = keys.splice(-1, 1)[0] || ""
        // 取到最后一个设置的对象 a.b[1]
        const data = keys.reduce((data, key) => {
            console.log("key", key, data);
            return data[key]
        }, firstVdom)
        // 设置对象的属性 为变化的值
        // a.b[1]['d'] = value
        if(data || endKey){
            data[endKey] = value
        }
        
    })
    // console.log("firstVdom", JSON.stringify(firstVdom, null, 2));
    return firstVdom
}

/**
 * 获取wxfor 的渲染函数
 * @param {*} wxForId 
 * @returns 
 */
function getWxForRenderFuncTemplateById(template, startIndex = 0){
    // wxFor逻辑
    const itemName = template.wxForItem || "item"
    const indexName = template.wxForIndex || "index"
    const wxForVarNameList = template.wxForVarNameList
    // console.log("template", template);
    // console.log("itemName indexName", itemName, indexName)
    let preList = []
    return function wxForRenderFunc(data, isFirstRender = false){
        // 首次渲染
        // 找到wxForList
        const nextList = []
        let list = typeof template.wxFor === "function" ? template.wxFor(data) : template.wxFor
        if(!list){
            // 如果是第一次渲染 则返回空列表
            if(isFirstRender){
                for(let i=0; i< 20; i++){
                    if(!nextList[i]){
                      nextList[i] = new NullNode()
                    }
                }
                preList = nextList
                return nextList
            }
            // 如果不是 则将原本节点都置为空节点
            list = []
        }
        // 遍历list
        const updateResult = new UpdateObject()
        // 之前存在的节点就更新
        for(let i = 0; i < list.length; i++){
            const item = list[i]
            // 判断之前有没有这个节点
            const pre = preList[i];
            let vdom
            let proxyRenderData
            // 之前没有这个节点，或者是空节点 执行初次渲染的逻辑
            if(!pre || pre.__null__){
                // 构建新的渲染数据 加入item 和index
                // 将原本数据放到原型上，取不到原型的值才会去原本渲染数据取
                const renderData = {}
                renderData[itemName] = item
                renderData[indexName] = i
                // 增加监听 传入需要监听的数据对象 监听属性 影响的template，第几个
                proxyRenderData = addObserver(renderData, [itemName, indexName], wxForVarNameList)
                // 给代理对象增加原型
                Object.setPrototypeOf(proxyRenderData, data)
                //  console.log("renderData", renderData);
                vdom = template.firstRender(proxyRenderData, i)
                // 构建下一次的列表数据
                nextList[i] = {
                    firstVdom: vdom,
                    data: proxyRenderData,
                    isShow: true
                }
            }else{
                pre.data[itemName] = item
                // 是否需要检查全部变化，如果是从隐藏到显示 就需要检查全部会变化的属性
                const isNeeCheckAllChange = !pre.isShow // 上一次是隐藏的
                // 原本就有值
                vdom = template.updateRender(pre.data, i, false, isNeeCheckAllChange)
                // 如果之前是隐藏的 则需要组合更新的节点和原有的节点为同一颗树
                if(isNeeCheckAllChange){
                    // 组合原有的属性 和需要更新的值 保留原本的节点树
                    vdom = combineFirstVdomAndUpdateVdom(pre.firstVdom, vdom)
                }
                // 构建下一次的列表数据
                nextList[i] = {
                    firstVdom: pre.firstVdom,
                    data: pre.data,
                    isShow: true
                }
                
            }
            const realKey = startIndex + i
            // result[realKey] = vdom
            // 将需要更新的key，以及对应的值 加到更新列表
            updateResult.add(realKey, vdom)
        }
        // 新节点列表没有 旧节点列表还存在的节点 需要删除
        for(let i = list.length; i < preList.length; i++){
            const pre = preList[i];
            // 如果前面就是被删掉的节点 那就不出来
            if(pre.isShow){
                // 不是空节点 就是需要删除的节点
                // 计算真正的key
                const realKey = startIndex + i
                pre.isShow = false
                updateResult.add(realKey, new NullNode())
            }
            nextList[i] = pre
        }
        // 输出结果看看
        //  console.log("wxForRenderFunc", result);
        // 保存当前的list 替换上一个list 便于下一次更新
        preList = nextList
        if(isFirstRender){
            for(let i=0; i< 20; i++){
                if(!nextList[i]){
                    nextList[i] = new NullNode()
                }
            }
            return nextList.map(item => item.firstVdom || item)
        }
        return updateResult

    }
}

let templateId = 0

const vdomsTemplate = {
    wxIf: true,
    id: templateId++,
    prekey: vdomsKey,
    firstTemplate: templateVDomCreateList
}

// 给渲染节点加上 首次渲染方法和再次渲染方法
addFirstAndUpdateRender(vdomsTemplate)
// 临时key堆栈
let tempKeyList = []
// // 外部代理数据对象
// const renderProxyData = {}
// // 真实数据对象
// let realData = {}
// 需要给data 加上监听函数的属性key
// console.log("dataKeys", dataKeys)
dataKeys.map(key=>{
    const dep = new Dep(key)
    Object.defineProperty(renderProxyData, key, {
        get: function(){
            // logCurrentTreeNodes()
            // 保存映射关系
            dep.addTempKey(tempKeyList)
            let value = realData[key]
            // console.log("get key value", key, value);
            return value
        },
        set: function(value){
            if(realData[key] === value){
                return
            }
            // console.log("set key value", key, value);
            realData[key] = value
            // 通知对应的属性更新
            dep.notify()
        }
    })
})
// wxs的值单独监听 只需要返回结果就可以
pageWxsObjKeys.map(key =>{
    Object.defineProperty(renderProxyData, key, {
        get: function(){
            return pageWxsObj[key]
        },
        set: function(value){
        }
    })
})

module.exports = {vdomsTemplate, Dep}