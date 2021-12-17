const tagName = "keyboard-accessory"
const haveChlidren = true
const documentStr = `


`

const lineList = documentStr.split("\n").filter(str => !!str)
// console.log("lineList", lineList);
const propList = []
lineList.map(line => {
    const charList = line.split("\t")
    // console.log("charList", charList);
    const propKey = charList[0]
    const propType = charList[1]?.toLowerCase()
    let defaultValue = charList[2]
    const isMust = charList[3] === '是'
    // 如果不是必填 则需要默认值
    if(!isMust){
        if(propType.indexOf("string") !== -1 ){
            defaultValue=`'${defaultValue}'`
        }else if(propType === "object"){
            defaultValue = `'', true`
        }else if (propType.indexOf("array") === 0){
            defaultValue = "[]"
        }else if (propType === "number" && !defaultValue){
            defaultValue = 0
        }else if(propType === "boolean" && !defaultValue){
            defaultValue = "false"
        }
    }
    let value = `{{${isMust ? `item.${toHump(propKey)}` : `utils.getValue(item.${toHump(propKey)}, ${defaultValue})`}}}`
    if(propKey.indexOf("bind") === 0 || propType === "eventhandle"){
        value="eventHandler"
    }
    // console.log("属性：", propKey, propType, defaultValue, isMust);
    const onePropStr = `${propKey}="${value}"`
    propList.push(onePropStr)
})
const propStr = propList.join("\n    ")

const childrenStr = `<template is="{{utils.getTemplateByCid(cid+1)}}" data="{{\${vdomsKey}: item.\${childrenKey}, cid: cid+1}}"></template>`

const res = `
<template name="tmpl_0_${tagName}">
  <${tagName}
    wx:key="{{item.key}}" data-data="{{item.dataSet}}" id="{{item.uid}}"
    style="{{item.style}}" class="{{item.class}}"
    ${propStr}
  >
    ${haveChlidren ? childrenStr : ""}
  </${tagName}>
</template>
`
console.log("res");
console.log(res);
// --------------------- 工具函数 -------------------
/**
 * 转换字符串为驼峰
 * @param str 目标字符
 * @returns 结果字符
 */
 function toHump(str){
    if(!str){
      return str
    }
    return str.replace(/-(\w)/g, (all, $1) => {
      return $1.toUpperCase()
    })
  }