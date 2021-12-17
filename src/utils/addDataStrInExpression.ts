const acorn = require("acorn")
const walk = require("acorn-walk")
const escodegen = require('escodegen');//JS语法树反编译模块
const dataKeyList: string[] = []
const unExpectList: string[] = []
const unExpectListDependenKeyMap: any = {}
const ignoreMap = {}

export interface wxForVarName {
  key: string,
  secondKeyList?: string
}
/**
 * 增加一个列表
 * @param list 
 * @returns 
 */
export function addUnExpectList(list: string[] | string, isIgnore = false){
  if(!list){
    return
  }
  if(typeof list === "string"){
    list = [list]
  }
  if(Array.isArray(list)){
    list.map(key => {
      // 不考虑去重 如果两重for 的情况就有可能是重复的key
      unExpectList.push(key)
      ignoreMap[key] = isIgnore
    })
  }
  
}

/**
 * 移除排除key 或 列表
 * @param key 
 */
export function removeUnexpectList(list: string[] | string): wxForVarName[]{
  // 如果是字符串 则构建成数组
  if(typeof list === "string"){
    list = [list]
  }
  if(!list || !Array.isArray(list)){
    // 不存在list 或者不是数组
    return []
  }
  const result = list.map(key => {
    // 不考虑去重 如果两重for 的情况就有可能是重复的key
    const index = unExpectList.indexOf(key)
    if(index >= 0){
      unExpectList.splice(index, 1)
    }
    let secondKeyList
    // 检查是否有第二层依赖key·
    if(unExpectListDependenKeyMap[key]){
      // 得到第二层依赖关系
      secondKeyList= unExpectListDependenKeyMap[key]
      // 删除映射关系
      delete unExpectListDependenKeyMap[key]
    }
    // 无论有没有都返回wxForItem 的str， 这样在运行阶段 就可以少处理一次
    return {
      key, // 第一层key
      secondKeyList, // 第二层key列表
    }
  })
  // 返回结果 如果 result长度为0 则返回undefined 方便后续判断
  return result
}

/**
 * 给表达式增加上data. 取值，比如说 name => data.name
 * @param str 表达式字符
 * @param unExpectList 不期待的字符列表
 * @returns 
 */
export function addDataStrInExpression(str: string, isObject: boolean = false): string {
  let ast

  try {
    if(isObject){
      str = `var data = {${str}}`
    }
    ast = acorn.parse(str)
  } catch (error) {
    throw new Error("转换表达式为ast出错:"+str)
  }
  if(!ast){
    throw new Error("转换表达式为ast出错:"+str)
  }
  handleAst(ast)

  // console.log("ast", ast.body[0].expression);
  let generateCode  = escodegen.generate(ast, {}).replace(/;/g, "")
  if(isObject){
    // console.log("escodegen", generateCode);
    generateCode = generateCode.replace(/^var data = /, "").replace(/(\n)|(\r)|\s/g, "")
  }
  return generateCode
  
}

/**
 * 获得wxml内使用的data属性列表
 * @returns 
 */
export function getDataKeyList(): string[]{
  return dataKeyList
}

/**
 * 处理ast树，加上data.的字符串
 * @param ast 
 */
function handleAst(ast: any){
  walk.ancestor(ast, {

    /**
     * 遍历复杂表达式， 比如说： item.x.y , item[1], item["name"]
     * @param node 
     */
    MemberExpression(node: any){
      // console.log("MemberExpression", node)
      /**
       * 示例输出
       * MemberExpression Node {
          type: 'MemberExpression',
          start: 0,
          end: 10,
          object: Node { type: 'Identifier', start: 0, end: 4, name: 'item' },
          property: Node { type: 'Identifier', start: 5, end: 10, name: 'title' },
          computed: false,
          optional: false
        }
       * MemberExpression Node {
          type: 'MemberExpression',
          start: 0,
          end: 18,
          object: Node {
            type: 'MemberExpression',
            start: 0,
            end: 10,
            object: Node { type: 'Identifier', start: 0, end: 4, name: 'item' },
            property: Node { type: 'Identifier', start: 5, end: 10, name: 'value' },
            computed: false,
            optional: false
          },
          property: Node { type: 'Identifier', start: 11, end: 18, name: 'onlyKey' },
          computed: false,
          optional: false
        }
       */
      // 取最初两层调用 比如：item.info.test ==> item.info 然后判断第一层调用是否为 wx:ForItem 对应的变量
      let secondFloorNode = node.property
      let firstFloorNode = node.object
      // 如果第一层还是 menberExpression
      while(firstFloorNode.type === "MemberExpression"){
        // 重设第一第二层节点
        secondFloorNode = firstFloorNode.property
        firstFloorNode = firstFloorNode.object
      }
      // 找到节点对应的变量名
      if(firstFloorNode.type === "Identifier" && secondFloorNode.type === "Identifier"){
        const firstLoorName = firstFloorNode.name
        // 需要收集item 用到的属性列表 比如说 item.name  item.title ==> ["name", "title"]
        // 先判断是单独引用 item，还是有引用到第二层 item.name
        // 单独引用不做处理 
        // 存在第二层引用则收集key
        // console.log("unExpectList", unExpectList, firstLoorName);
        
        
        if(unExpectList.indexOf(firstLoorName) !== -1){
          // 给第一层引用的节点设置一个标志位 用于修改表达式
          firstFloorNode.isUnExpectMemberExpression = true
          // 拿到第二层引用的name 
          const secondFloorName = secondFloorNode.name
          // console.log("firstLoorName", firstLoorName, secondFloorName);
          
          // 将第二层的name 加到映射中 
          if(!unExpectListDependenKeyMap[firstLoorName]){
            unExpectListDependenKeyMap[firstLoorName] = []
          }
          // 如果之前没加入过映射列表
          if(unExpectListDependenKeyMap[firstLoorName].indexOf(secondFloorName) === -1){
            unExpectListDependenKeyMap[firstLoorName].push(secondFloorName)
          }
        }
      }
    },
    /**
     * 对于对象的key属性是不需要改变的
     * @param node 
     */
     ObjectExpression(node: any){
      // 遍历属性列表
      /**
       * {
            "type": "ObjectExpression",
            "start": 10,
            "end": 35,
            "properties": [
              {
                "type": "Property",
                "start": 11,
                "end": 19,
                "method": false,
                "shorthand": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 11,
                  "end": 14,
                  "name": "num"
                },
                "value": {
                  "type": "Identifier",
                  "start": 16,
                  "end": 19,
                  "name": "num"
                },
                "kind": "init"
              },
              {
                "type": "Property",
                "start": 21,
                "end": 27,
                "method": false,
                "shorthand": false,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 21,
                  "end": 24,
                  "name": "ddd"
                },
                "value": {
                  "type": "Literal",
                  "start": 26,
                  "end": 27,
                  "value": 1,
                  "raw": "1"
                },
                "kind": "init"
              },
              {
                "type": "Property",
                "start": 29,
                "end": 34,
                "method": false,
                "shorthand": true,
                "computed": false,
                "key": {
                  "type": "Identifier",
                  "start": 29,
                  "end": 34,
                  "name": "test2"
                },
                "kind": "init",
                "value": {
                  "type": "Identifier",
                  "start": 29,
                  "end": 34,
                  "name": "test2"
                }
              }
            ]
          }
       */
      const properties: any[] = node.properties || []
      properties.map((property: any) => {
        // 将原本缩写的字符改为false {name} 这种情况，name既是key 也是value 
        // 所以就用缩写这个标记表示，后面重新生成代码的时候，也会根据这个来生成代码
        property.shorthand = false 
      })
    }

  })
  walk.ancestor(ast, {
    Identifier(node: any) {
      // console.log("this Identifier ", node);
      if(node.name === "undefined"){
        return
      }
      const name = node.name
      // 记录node.name
      // 如果是wxFor的item 和 index
      if(unExpectList.indexOf(name) > -1){
        // 如果是不需要记录的key 如果是memberExpression 的节点 需要修改name 比如：item.age => _item.age
        if(!ignoreMap[name] && node.isUnExpectMemberExpression){
          node.name = "_" + node.name
        }
      } else if(dataKeyList.indexOf(name) === -1){
        dataKeyList.push(name)
      }
      const oldNode = Object.assign({}, node)
      node.type = "MemberExpression"
      node.property = oldNode
      node.object = {
        type: 'Identifier',
        name: 'data'
      }
    }
  })
}


// -------- test 测试代码 -----
// addDataStrInExpression("myclass")
// addDataStrInExpression("false")
// addDataStrInExpression("1")
// addDataStrInExpression("item.type + 'xxx'")
// addDataStrInExpression("'xxxx' + item.name.show + item.name")
