/**
 * 测试初次渲染和再次渲染
 */
// 需要设置全局对象给page-diff文件使用 不然会报错
templateVDomCreateList = []
pageWxsObjKeys = []
pageWxsObj = {
}
// 真实数据对象
realData = {
    isShow: false,
    a: false,
    b: "bbbbb",
    age: 18,
    elseifShow: true,
    varStr: "变量字符串",
    varStr2: "",
    list: ["数组3", "数组2", "数组1"].map((key, index) => {
        return {
            title: key,
            tip: "tip"+index,
            value: "value"+index
        }
    })
}
// 外部代理数据对象
renderProxyData = {}
data = renderProxyData

dataKeys =  Object.keys(realData)
const isDev = true
const childrenKey = isDev ? "_a" : "children"
const contentKey = isDev ? "_b" : "content"
const tagNameKey = isDev ? "_c" :  "tagName"
const attributesKey = isDev ? "_d":  "attributes"
const vdomsKey = isDev ? "_e":  "vdoms"
// ---------------------- 下面是主要代码 ---------------------
const {vdomsTemplate} = require("../src/runtime-code/page-diff.js")


// ------- 测试代码 ----------

vdomsTemplate.firstTemplate = [{
    tag: "view",
    uid: 0,
    [attributesKey]: [
        {
            key: "name",
            value: "xxxx"
        }
    ],
    [childrenKey]: [
        {
            tag: "text",
            uid: 2,
            [contentKey]: function(data){
                return data.varStr || "我是变量"
            }
        },
        {
            tag: "text",
            uid: 3,
            [contentKey]: function(data){
                return data.a && data.b
            }
        },
        {
            tag: "text",
            uid: 4,
            [contentKey]: "我是常量"
        },
        {
            tag: "view",
            uid: 5,
            wxIf: function(data){
                return data.isShow
            },
            [attributesKey]: [
                {
                    key: "name",
                    value: "wxif"
                }
            ],
            [childrenKey]:[
                {
                    tag: "text",
                    [contentKey]: function(data){
                        return data.varStr2 || "第二个字符变量"
                    }
                }
            ]

        },
        {
            tag: "view",
            uid: 7,
            wxFor: function(data){
                return data.list || []
            },
            wxForVarNameList: [
                { key: 'item', secondKeyList: [ 'value', 'title', 'tip', 'id' ] },
                { key: 'index', secondKeyList: undefined }
            ],
            [attributesKey]: [
            ],
            [childrenKey]: [
                {
                    tag: "text",
                    [contentKey]: function(data){
                        return data._item.title
                    }
                },
                {
                    tag: "text",
                    [contentKey]: function(data){
                        return data._item.tip
                    }
                }
            ]
        },
        {
            tag: "text",
            uid: 8,
            [contentKey]: function(data){
                return data.varStr2 || "我是变量"
            }
        },
    ]

}]


const vdoms = vdomsTemplate.firstRender(data)
 console.log(vdomsKey, JSON.stringify(vdoms, null, 2));
//  console.log(vdomsTemplate.updateTemplateList[0]['vdoms[0].[childrenKey][2]']);

// data.isShow = true
// data.varStr = "新变量字符"
// data.age = 100
// data.varStr2 = "我是第二个变量"
data.list = ["change1", "change2"].map((key, index) => {
    return {
        title: key,
        tip: "tip"+index,
        value: "value"+index
    }
})
// data.a = false
//  console.log("changeData", data);
let updateResult = vdomsTemplate.updateRender(data, 0, true)
console.log("updateResult", JSON.stringify(updateResult.getObjValue(), null, 2));

data.list = ["change1", "change2", "change3", "change4"].map((key, index) => {
    return {
        title: key,
        tip: "tip"+index,
        value: "value"+index
    }
})
updateResult = vdomsTemplate.updateRender(data, 0, true)
console.log("updateResult", JSON.stringify(updateResult.getObjValue(), null, 2));

// data.b = "8888"
// data.varStr2 = "xxxxxx"
// updateResult = vdomsTemplate.updateRender(data, 0, true)

// data.list = ["数组3", "数组2", "数组1"]
// updateResult = vdomsTemplate.updateRender(data, 0, true)
// data.list = ["数组1", "数组2", "数组3", "数组3", "新数组3", "新数组3", "新数组3"]
// updateResult = vdomsTemplate.updateRender(data, 0, true)
// console.log("updateResult", JSON.stringify(updateResult.getObjValue(), null, 2));

// let updateObject = new UpdateObject()
// console.log("updateObject", updateObject);
// console.log("updateObject", updateObject.__update__);
// updateObject = new UpdateObject(true)
// console.log("updateObject", updateObject);
// console.log("updateObject", updateObject.__update__);


