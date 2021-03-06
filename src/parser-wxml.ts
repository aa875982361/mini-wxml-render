/**
 * 处理wxml 的表达式分为两个阶段
 * 编译阶段
 *  1. 将含有表达的字符串统一用function替代
 * 运行阶段
 *  1. 将function执行，得到字符串
 */
import * as path from "path"
import * as fs from "fs"
import file from "./utils/file"
import {addDataStrInExpression, getDataKeyList, addUnExpectList, removeUnexpectList} from "./utils/addDataStrInExpression"
import { attributesKey, childrenKey, contentKey, isProd, tagNameKey } from "./gen-render-page"
import { wxForVarName } from "./utils/addDataStrInExpression"
const himalay = require("himalaya")

/**
 * 属性配置
 */
 export interface AttributeConfig {
  [key: string]: string
}
/**
 * 自定义组件简单类型
 */
export interface CustomComponentSimpleProps {
  hasChildren?: boolean,
  attribute: AttributeConfig
}
/**
 * 全部自定义组件的配置 不是单个
 */
export interface CustomComponentConfig {
  [tagName: string]: CustomComponentSimpleProps,
}

export interface ImportTag {
  tagName: string,
  src: string
}
/**
 * 解析wxml的返回结果类型
 */
export interface ParseWxmlResult {
  renderFunctionStr: string,
  customComponentConfig: CustomComponentConfig,
  importList: ImportTag[]
}

interface VDom {
  uid?: string,
  type?: string,
  tagName?: string,
  attributes?: Attribute[],
  children?: VDom[],
  content?: string,
  dataSet?: object,
  wxForVarNameList?: wxForVarName[]
}

interface Attribute {
  key: string,
  value: string | boolean
}

// 属性的映射
const attributeKeyMap = {
  "wx:if": "wxIf",
  "wx:for": "wxFor",
  "wx:elif": "wxElif",
  "wx:else": "wxElse",
  "wx:for-item": "wxForItem",
  "wx:for-index": "wxForIndex",
  "wx:key": "wxKey",
}

// 需要绑定属性到跟节点列表的属性 wxFor wxIf ....
const needToBindRootAttributeKeyList = Object.keys(attributeKeyMap).map((key): string=>attributeKeyMap[key])
// 新增的变量值，并非data的属性值
const addVarKeyNotDataAttributeKeyList = ["wxForItem", "wxForIndex"]
// 标签的基本属性
const baseTagAttributes = ["style", "class"]

// 用于存储id和uid的映射关系
let uidAndOriginIdMap = {}
let originIdAndUidMap = {}
// 用于存储表达式和key的映射 用于替换文本 因为json不能序列化函数
let allExpressStrMap = new Map()
// 用于存储事件和方法名的映射关系
let uidEventHandlerFuncMap = {}
// 自定义组件标签名和对应属性的映射关系{comp1: { key1: "value1"}, comp2: {key}}
let customComponentConfigAllObj: CustomComponentConfig = {}
// import标签列表
let importList: ImportTag[] = []
let wxsMap = {}
let pageWxs = {} // 页面使用到的wxs module key 和 资源映射key
let wxmlPath = ""
let miniappRootPath = ""
let globalWxsInlineKey = 1000

// tslint:disable-next-line:no-big-function
export default function main(_wxmlPath?: string, targetPath?: string, _miniappRootPath?: string): ParseWxmlResult{
  // 初始化
  uidAndOriginIdMap = {}
  originIdAndUidMap = {}
  allExpressStrMap = new Map()
  uidEventHandlerFuncMap = {}
  customComponentConfigAllObj = {}
  importList = []
  wxsMap = {}
  pageWxs = {}
  wxmlPath = ""
  miniappRootPath = ""
  globalWxsInlineKey = 1000
  if(!_wxmlPath){
    throw new Error("请输入wxml地址")
  }
  wxmlPath = _wxmlPath
  // 小程序根目录
  miniappRootPath = file.handlePath(_miniappRootPath) || ""
  // 构建页面wxml对应的json配置
  const jsonPath = wxmlPath.replace(/wxml$/, "json") 
  // 读取页面对应的json
  const jsonObj = file.read(jsonPath, true) as any
  if(jsonObj){
    // 读取到自定义组件的列表 ["comp1", "comp2"]
    // 我后面要组装成 {tageName: "comp1", attributes: [{key: value}]}, 但是为了方便设置值，我会设计成以下对象
    // {comp1: { key1: "value1"}, comp2: {key}}
    Object.keys(jsonObj.usingComponents || {}).forEach((compName: string) => {
      // 初始化自定义组件名对应的属性
      customComponentConfigAllObj[compName] = {
        hasChildren: false,
        attribute: {}
      }
    })
  }
  // 读取wxml文件
  const html = fs.readFileSync(wxmlPath, { encoding: 'utf8' })
  // 解析wxml
  let json: VDom[] = himalay.parse(html)
  // 重置
  allExpressStrMap = new Map()
  uidEventHandlerFuncMap = {}
  pageWxs = {}
  // 编译处理wxml 处理含有表达式的字符串
  json = compileFunction(json, {})
  // console.log("pageWxs", pageWxs)
  // 转换wxml ast树为json字符串 因不可转换函数，固将函数用特定key替代
  let templateJson: any = JSON.stringify(json, null, 2) || ""
  // 将特定key 转化为函数
  templateJson = handleRandomKeyToStr(templateJson, allExpressStrMap)
  const pageDiffPath = path.join(__dirname, "./runtime-code/page-diff.js")
  // 拿到模板渲染json
  let pageDiffCodeStr: string = file.read(pageDiffPath, false) as string || ""
  pageDiffCodeStr = pageDiffCodeStr.replace(/module.exports(.*?)$/, "")
  pageDiffCodeStr = pageDiffCodeStr.replace("const isProd = true", `const isProd = ${isProd}`)

  /**
   * 根据渲染模板构建渲染函数，生成一个运行时函数，可以根据 页面data 生成页面渲染节点
   */
  const renderFunctionStr = `
const wxsMap = ${getWxsMapStr(wxsMap)};
const pageWxs = ${JSON.stringify(pageWxs)}
const uidEventHandlerFuncMap = ${handleRandomKeyToStr(JSON.stringify(uidEventHandlerFuncMap), allExpressStrMap)};
const templateVDomCreateList = ${templateJson};
const dataKeys = ${JSON.stringify(getDataKeyList())}
const pageWxsObj = {}
const pageWxsObjKeys = []
// 外部代理数据对象
const renderProxyData = {}
// 真实数据对象
let realData = {}
Object.keys(pageWxs).map(key=>{
  // 执行函数 构建wxs对象
  if(pageWxs[key] && typeof wxsMap[pageWxs[key]] === "function"){
    pageWxsObj[key] = wxsMap[pageWxs[key]]()
    if(pageWxsObjKeys.indexOf(key) === -1){
      pageWxsObjKeys.push(key)
    }
  }
})

/**
 * 根据字符构建正则
 */
function getRegExp(str, tag){
  return new RegExp(str, tag)
}

/**
 * 处理事件 this指向为pageObj 是内部页面的方法和数据
 */
function eventHandler(event){
  // console.log("event", event);
  // 如果事件已经停止冒泡 则不触发
  if(event.isCatch){
    return
  }
  const {type = "", currentTarget = {}} = event || {}
  const {id = ""}  = currentTarget
  if(id && type){
    const key = id+"_"+type
    // console.log("event handle key", key);
    const eventHandlerFuncObj = uidEventHandlerFuncMap[key] || {}
    const isCatch = eventHandlerFuncObj.isCatch
    if(isCatch){
      event.isCatch = true
    }
    const value = eventHandlerFuncObj.value || ""
    if(typeof value === "function"){
      // 需要一个data 用于处理表达式
      value = value(this.data)
    }
    // 处理event的dataSet 将原本的 data-type 转换为 dataset: {type: ""}
    const realDataSet = event?.target?.dataset?.data
    const currentTargetDataset = event?.currentTarget?.dataset?.data
    // console.log("event", event)
    if(realDataSet || currentTargetDataset){
      const target = event.target || {}
      const currentTarget = event.currentTarget || {}
      event = {
        ...event,
        currentTarget:{
          ...currentTarget,
          dataset: {
            ...currentTargetDataset
          }
        },
        target: {
          ...target,
          dataset: {
            ...(realDataSet || {})
          }
        }
      }
      // console.log("dataset", realDataSet, event)
    }
    if(typeof value === "function"){
      // 对象设置原本就是个function 则直接触发
      value(event)
    } else if(typeof this[value] === "function"){
      // 返回的是字符串 在对象上能找到对应的方法
      this[value](event)
    } else {
      // 没有对应的事件触发
      // console.log("event 没找到对应的事件", key)
    }
  }
}

/**
 * 根据 data 构造渲染结果
 * @param data
 */
function renderFunction(data = {}, isFirstRender = false){
  // 渲染的时候将渲染数据加到数据源的原型上
  // 遍历节点 将属性值为函数的都执行一遍 获得渲染结果
  // console.log("renderFunction data", data)

  const newVdoms = isFirstRender ? vdomsTemplate.firstRender(data) : vdomsTemplate.updateRender(data, 0, true).getValue()
  // console.log("newVdoms", JSON.stringify(newVdoms, null, 2));
  return newVdoms
}
// ------- 下面是找出数据变化后，最少的数据改动对象 ----- 
// ---------------------- 下面是主要代码 ---------------------

${pageDiffCodeStr}
  `
  if(targetPath){
    fs.writeFileSync(targetPath, renderFunctionStr, { encoding: 'utf8' })
  }
  return {
    customComponentConfig: customComponentConfigAllObj,
    renderFunctionStr,
    importList
  }

}

//  -------------------- js 处理函数 -----------------------
/**
 * 将字符串内部的随机数替换为映射的值
 * @param str 
 * @param 
 * @returns 
 */
function handleRandomKeyToStr(str: string, map: Map<string, any>): string{
  // 存在map 则替换 不存在 则直接返回
  return map ? str.replace(/\"(\d{22})\"/g, (all: string, key: string): string => {
    if(map.has(key)){
      return map.get(key)
    }
    // console.log("没有对应的字符,", key, map);
    return all
  }) : str
}

/**
 * 根据wxsMap 构造wxsMap对象到js文件中，因为存在函数，不能直接json.stringify
 * @param _wxsMap 对象
 * @returns js文件的wxsMap对象
 */
function getWxsMapStr(_wxsMap: object): string {
  const res = Object.keys(_wxsMap).map((key): string => {
    const str = _wxsMap[key]
    return `'${key}':function(){
      var _result_ = {};
      ${str.replace("module.exports", "_result_")}
      return _result_;
    }`
  }).join(",")
  return `{${res}}`
}

/**
 * 根据相对文件路径获得对应的wxs文件
 * @param relativePath 相对文件路径
 */
function getWxsFileStrKeyByRelativePath(originPath: string, relativePath: string): string{
  const targetPath = path.join(originPath, "../",  relativePath)
  if(file.exists(targetPath)){
    // 获取相对根文件的目录
    const relativeRootPath = file.handlePath(targetPath.replace(miniappRootPath, ""))
    if(wxsMap[relativeRootPath]){
      return relativeRootPath || ""
    }
    // 读取文件对应的字符
    let wxsStr = file.read(targetPath, false) as string
    // 检查内部是否有其他文件的引用
    wxsStr = wxsStr.replace(/require\(('|")(.*?)\1\)/g, (all: string, $1: string, $2: string): string => {
      const nextRelativePath = $2
      const inlineRelativeRootPath = getWxsFileStrKeyByRelativePath(targetPath, nextRelativePath)
      return `wxsMap['${inlineRelativeRootPath}']()`
    })
    wxsMap[relativeRootPath] = wxsStr
    return relativeRootPath || ""
  }
  return ""
}

/**
 * 获得内联wxs对应的key
 * @param originPath wxml文件路径
 * @param wxsStr wxs内联字符
 * @returns wxs对应key
 */
function getWxsFileStrKeyByInlineWxs(originPath: string, wxsStr: string): number{
  const key = globalWxsInlineKey++
  // 检查内部是否有其他文件的引用
  wxsStr = wxsStr.replace(/require\(('|")(.*?)\1\)/g, (all: string, $1: string, $2: string): string => {
    const nextRelativePath = $2
    const relativeRootPath = getWxsFileStrKeyByRelativePath(originPath, nextRelativePath)
    return `wxsMap['${relativeRootPath}']()`
  })
  wxsMap[key] = wxsStr
  // wxs的属性 加到排除列表上
  return key
}

/**
 * 转换字符串为驼峰
 * @param str 目标字符
 * @returns 结果字符
 */
function toHump(str: string = ""): string{
  if(!str){
    return str
  }
  return str.replace(/-(\w)/g, (all, $1: string): string => {
    return $1.toUpperCase()
  })
}

/**
 * 编译渲染页面
 * @param vdoms 虚拟式节点
 * @param data 页面数据
 */
function compileFunction(vdoms: VDom[], data: object): VDom[]{
  // 深度遍历页面节点 主要是处理含有表达式的文本和属性值
  // 先调整一下wxs标签的顺序
  const newVdoms: VDom[] = []
  for(const vdom of vdoms){
    if(vdom.tagName === "wxs"){
      newVdoms.unshift(vdom)
    }else{
      newVdoms.push(vdom)
    }
  }
  return walkVDoms(newVdoms)
}

let uid = 0

/**
 * 遍历dom节点树
 * @param vdoms 节点树
 * @returns
 */
// tslint:disable-next-line:cognitive-complexity
function walkVDoms(vdoms: VDom[]): VDom[]{
  const len = vdoms.length
  const newVDoms: VDom[] = []
  for(let i = 0; i < len; i++){
    const vdom: VDom = vdoms[i]
    // console.log("dom type tagName", vdom.tagName, vdom.type);
    // 如果是注释 则不处理
    if(vdom.type === "comment"){
      continue
    }
    // uid 自增 保证不重复
    vdom.uid = uid++ + ""
    if(vdom.type === "text"){
      vdom[contentKey] = handleExpressionStr(vdom.content || "")
      if(vdom[contentKey]){
        if(contentKey !== "content"){
          delete vdom.content
        }
        delete vdom.type
        newVDoms.push(vdom)
      }
      continue
    } else if (vdom.tagName === "wxs"){
      // wxs 标签 用于处理js逻辑
      // 遍历属性
      // tslint:disable-next-line:no-shadowed-variable
      const attributes = vdom.attributes || []
      const attributesObj: any = {}
      // tslint:disable-next-line:prefer-for-of no-shadowed-variable
      for(let i=0; i < attributes.length; i++){
        const attribute = attributes[i]
        attributesObj[attribute.key || ""] = attribute.value
      }
      if(attributesObj.src){
        // 读取src 然后返回wxs对应的key
        attributesObj.src = getWxsFileStrKeyByRelativePath(wxmlPath, attributesObj.src)
      }else{
        // 内联wxs 读取content
        if(vdom.children && vdom.children.length > 0){
          const content = vdom.children[0]?.content || ""
          attributesObj.src = getWxsFileStrKeyByInlineWxs(wxmlPath, content)
        }
      }
      if(attributesObj.module && attributesObj.src){
        // 通过页面 pageWxs 记录下
        pageWxs[attributesObj.module] = attributesObj.src
        // 排除掉wxs的key 比如说 <wxs moudle="util" src="./a.wxs" />
        // console.log("addUnExpectList", attributesObj.module);
        addUnExpectList(attributesObj.module, true)
      }
      continue
    } else if (vdom.tagName === "import"){
      const oneImport: ImportTag = {
        tagName: vdom.tagName,
        src: ""
      }
      vdom.attributes?.forEach(item => {
        oneImport[item.key] = item.value
      })
      importList.push(oneImport)
      continue
    }
    // 自定义组件的配置
    const customComponentSimpleProps = customComponentConfigAllObj[vdom?.tagName || ""]
    const customComponentAttributeConfig: AttributeConfig = customComponentSimpleProps?.attribute

    // 遍历属性
    const attributes = vdom.attributes || []
    const unExpectList = walkAttributes(attributes, vdom, customComponentAttributeConfig)
    // 遍历子节点
    const children = vdom.children || []
    if(childrenKey !== "children"){
      delete vdom.children
    }
    vdom[childrenKey] = walkVDoms(children)
    // 判断自定义组件 是否存在孩子节点
    if(customComponentSimpleProps && vdom[childrenKey].length > 0){
      // 标记存在孩子节点
      customComponentSimpleProps.hasChildren = true
    }

    // 遍历完节点就把新增的变量去掉
    if(unExpectList && Array.isArray(unExpectList)){
      const wxForVarNameList = removeUnexpectList(unExpectList)
      // console.log("wxForVarNameList", wxForVarNameList);
      vdom.wxForVarNameList = wxForVarNameList
    }
    vdom[tagNameKey] = vdom.tagName
    if(tagNameKey !== "tagName"){
      delete vdom.tagName
    }
    delete vdom.type
    newVDoms.push(vdom)
  }
  return newVDoms
}

/**
 * 遍历属性列表
 * @param attributes
 */
// tslint:disable-next-line:cognitive-complexity
function walkAttributes(attributes: Attribute[], vdom: VDom, customComponentAttributeConfig: AttributeConfig): void | string[]{
  const len = attributes.length
  // 新的属性列表
  const newAttributes = []
  // 不需要记录的属性列表，比如item,index
  let unExpectList: string[] = []
  // 是否含有绑定事件 含有的话 则用view 的大模板
  let haveBindEvent = false
  // 是否含有除了class 和 style 属性之外的属性
  let haveOtherAttribute = false
  // 是不是template 模板
  const isTemplate = vdom.tagName === "template"
  // 是不是含有id属性
  let originId = ""
  // 组件名
  const tagName = vdom.tagName || ""
  // 自定义组件的配置
  // const customComponentAttributeConfig: AttributeConfig = customComponentConfigAllObj[tagName]?.attribute
  // 判断是否为自定义组件
  const isCustomComponent = !!customComponentAttributeConfig
  for(let i = 0; i < len; i++){
    const attribute: Attribute = attributes[i]
    attribute.value = typeof attribute.value === "string" ? handleExpressionStr(attribute.value, isTemplate && attribute.key === "data"): true
    attribute.key = attributeKeyMap[attribute.key] || attribute.key || ""
    // 之前没有其他属性 并且当前属性名不在基础属性列表内
    if(!haveOtherAttribute && baseTagAttributes.indexOf(attribute.key) === -1){
      // 标记有其他属性
      haveOtherAttribute = true
    }

    // 特定wxFor 提到节点根属性上 方便后续判断
    if (needToBindRootAttributeKeyList.indexOf(attribute.key) >= 0 ){
      vdom[attribute.key] = attribute.value
      // 如果wxFor 就自动新增两个属性 index item 是需要排除的
      if(attribute.key === "wxFor"){
        const list = ["item", "index"]
        addUnExpectList(list)
        unExpectList = unExpectList.concat(list)
      // 如果是新增的属性值 wx:for-item="detailItem"
      }else if(addVarKeyNotDataAttributeKeyList.indexOf(attribute.key) >= 0 && typeof attribute.value === "string" ){
        // 移除 默认的item 或 index
        const defaultKey = attribute.key.indexOf("Item") > 0 ? "item" : "index"
        removeUnexpectList(defaultKey)
        const index = unExpectList.indexOf(defaultKey)
        if(index >= 0){
          // 移出待会需要移除的key列表
          unExpectList.splice(index, 1)
        }
        // 将属性值 放到不统计列表
        addUnExpectList(attribute.value)
        unExpectList.push(attribute.value)
      }
      
      // 存在事件
    } else if( attribute.key.indexOf("bind") === 0 || attribute.key.indexOf("catch") === 0) {
      // 标记有绑定事件
      haveBindEvent = true
      let key = attribute.key || ""
      const isCatch = attribute.key.indexOf("catch") === 0
      // 拼接uid及事件名 作为key，用于事件委托找到真正的事件
      const eventKey = `${vdom.uid}_${key.replace(/^(bind|catch):?/, "")}`
      uidEventHandlerFuncMap[eventKey] = {
        value: attribute.value,
        isCatch
      }
      if(isCatch){
        // 将catch 改为bind
        key = key.replace("catch", "bind")
      }
      // 自定义组件的事件 事件都使用事件代理 事件名都是同样的
      if(isCustomComponent){
        customComponentAttributeConfig[key] = "eventHandler"
      }

    } else {
      const key = attribute.key
      if(key === "id" && typeof attribute.value === "string"){
        const currentUid = vdom.uid
        vdom.uid = attribute.value
        // uid和事件的映射 需要修改 如果先写事件的话
        const originKeyStart = currentUid + "_"
        Object.keys(uidEventHandlerFuncMap).map(key => {
          // 如果是原本uid_开头的 则需要修改
          if(key.indexOf(originKeyStart) === 0){
            const newKey = key.replace(originKeyStart, attribute.value + "_")
            uidEventHandlerFuncMap[newKey] = uidEventHandlerFuncMap[key]
            delete uidEventHandlerFuncMap[key]
          }
        }) 
      }
      // 不是自定义组件的dataset 才使用代理
      else if(!isCustomComponent && key.indexOf("data-") === 0){
        attribute.key = key.replace("data-", "")
        if(!vdom.dataSet){
          vdom.dataSet = {}
        }
        vdom.dataSet[attribute.key] = attribute.value
      }else{
        // 将key转化为驼峰，比如说 core-name => coreName  data-name => dataName
        // 为什么要这样转化呢？ 因为在使用标签渲染的时候方便设置属性
        attribute.key = toHump(key)
        if(isCustomComponent){
          // 如果是自定义组件，需要收集属性，并找到对应的key
          // 例如：core-name => coreName 我会把coreName作为节点key，
          // 在渲染页面的时候可以通过node.coreName取到值， 然后赋值给自定义组件的core-name 属性
          // <view core-name="{{item.coreName}}"></view>
          customComponentAttributeConfig[key] = attribute.key
        }

        newAttributes.push(attribute)
      }
    }
  }
  // 判断是用原生的view 还是其他 
  // 不存在绑定事件的情况 并且是view节点 再做二次判断
  if(vdom.tagName === "view" && !haveBindEvent){
    // 如果含有其他属性 则用静态节点 否则用原生节点
    let preTag = ""
    if(haveOtherAttribute){
      preTag = "static"
    }else{
      // 否则就是原生
      preTag = "pure"
    }
    vdom.tagName = preTag + "-" + vdom.tagName
  }

  // 存在id 则记录映射
  if(originId){
    uidAndOriginIdMap[vdom.uid!] = originId
    originIdAndUidMap[originId] = vdom.uid
  }
  vdom[attributesKey] = newAttributes
  if(attributesKey !== "attributes"){
    delete vdom.attributes
  }
  if(unExpectList.length > 0){
    return unExpectList
  }
}
/**
 * 处理可能含有表达式的字符
 * @param expressionStr 可能含有表达式的字符
 */
function handleExpressionStr(expressionStr: string = "", isObject: boolean = false): string {
  if(!expressionStr){
    return ""
  }
  expressionStr = expressionStr.replace(/(^\s*)|(\s*$)/g, "")
  const list = expressionStr.match(/\{\{(.*?)\}\}/g)
  const key = getRandomOnlyKey()
  if(list && list.length > 0){
    // console.log("我含有表达式", expressionStr);
    // 目标场景
    // {{xxx}}
    // as {{xxx}}
    // cksa {{xxx}} dsd
    // asd {{xxx}} sda {{zzzz}}
    // ((.*?)({{(.*?)}})*)
    // 排查第一种场景 其他都是字符拼接
    // console.log("list", list);
    let result = ""
    if(list.length === 1 && /^\{\{/.test(expressionStr) && /\}\}$/.test(expressionStr)){
      // console.log("第一种情况");
      result = expressionStr.slice(2, -2)
      // console.log("result", result);
      result = handleExpressionInner(result, isObject)
    }else{
      // console.log("其他情况");
      result  = `"${expressionStr.replace(/\{\{(.*?)\}\}/g, (all, $1): string=>{
        // console.log("$1", $1);
        // tslint:disable-next-line:no-nested-template-literals
        return `"+(${handleExpressionInner($1)})+"`
      })}"`
    }
    // console.log("result", result);

    const funcStr = `function (data){
      var res = "";
      try{
        res = ${result}
      }catch(e){
        console.warn(\`执行：${result}，失败\`, e?.message)
      }
      return res
    }`
    // console.log("funcStr", funcStr);
    allExpressStrMap.set(key, funcStr)
  }else{
    // console.log("expressionStr", expressionStr);
    if(expressionStr.indexOf("\\") === -1){
      return expressionStr
    }
    allExpressStrMap.set(key, `"${expressionStr}"`)
  }
  return key
}

/**
 * 获得唯一的key
 * @returns
 */
function getRandomOnlyKey(): string {
  // tslint:disable-next-line:no-bitwise
  const random = 100000000 + Math.random()*100000000 >> 0
  const timeStamp = +new Date()
  const key = "" + timeStamp + "" + random
  // 如果存在
  if(allExpressStrMap.has(key)){
    return getRandomOnlyKey()
  }
  return key
}

/**
 * 处理表达式内部字符 给属性加上data.
 * @param str
 */
function handleExpressionInner(str: string, isObject: boolean = false): string{
  // 情形列举
  // showData=
  // item.name + 1
  // !!item
  // item['1'].name
  // false
  // 1
  // 'xxx'
  // "xxxxx"
  str = addDataStrInExpression(str, isObject)

  return str
// tslint:disable-next-line:max-file-line-count
}



// ----- test --- 
// main()
