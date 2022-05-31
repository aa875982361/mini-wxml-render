/**
 * 主要用于生成一个主要渲染页
 * 1. 收集依赖的js
 * 2. 收集依赖的wxml 和 component
 * 3. 收集依赖的wxss
 * 4. 根据以上信息 生成一个主要渲染页，用于渲染其他页面
 */

import { readFileSync } from "fs";
import { join } from "path";
import { CustomComponentConfig, ImportTag } from "./parser-wxml";


export type RequirePathAndKeyMap = Record<string, string[]> 
export type ImportPathAndKeyMap = RequirePathAndKeyMap
// js 使用到的变量
// 请求路径和 请求变量命名的映射 比如说
// var util = require("./util.js")
// {"/user/abs/util.js": ["util"]}
// 兼容多个变量名的情况，所以使用这种方式映射
let requirePathAndKeyMap: Record<string, string[]> = {
}
// 兼容使用import 方式引入代码的情况
let importPathAndKeyMap: Record<string, string[]> = {
}
// 在主要渲染页面的时候，传入虚拟机的变量名
let allRequireKeyList: string[] = []

// json 使用到的变量 
// 使用到的组件 承载页面只增加使用组件
let usingComponents = {}

// wxml 使用到的变量
// 自定义组件的属性
let allCustomComponentConfig: CustomComponentConfig = {}
// import wxml 列表
let allImportList: ImportTag[] = []
// import wxml 的key列表 判断是否有加入过
let allImportKeyList: string[] = []

// wxss 使用到的变量
// 依赖的wxss 文件
// 比如说：@import '../../style/weui.wxss';
let importWxssPathList: string[] = []
// 其他自己写的wxss
let otherWxssStrList:string[] = []

/**
 * 收集依赖到的外部js
 */
export function addDependenceJsByPath(jsPath: string): void{
    // console.log("addDependenceJsByPath", jsPath);
    
    // 读取文件
    let code = readFileSync(jsPath, {encoding: "utf-8"})
    // 找出引用的资源
    code = code.replace(/var (.*?) = require\(['"](.*?)['"]\);?/g, (all, requireKey, requirePath): string => {
        // 获取绝对路径
        const absImportJsPath = join(join(jsPath, "../"), requirePath)
        console.log("requireKey, absImportJsPath", requireKey, absImportJsPath);
        if(!requirePathAndKeyMap[absImportJsPath]){
            requirePathAndKeyMap[absImportJsPath] = []
        }
        const requireKeyList = requirePathAndKeyMap[absImportJsPath]
        // 判断之前是否加入过key
        if(!requireKeyList.includes(requireKey)){
            requireKeyList.push(requireKey)
        }
        // 加入全部文件的require key 在加载js的时候传进去
        addAllRquireKey(requireKey)
        return ""
    })
    // 处理import 引入
    code = code.replace(/import (.*?) from ['"](.*?)['"];?/g, (all, importKey, requirePath): string => {
        // 获取绝对路径
        const absImportJsPath = join(join(jsPath, "../"), requirePath)
        console.log("importKey, absImportJsPath", importKey, absImportJsPath);

        if(!importPathAndKeyMap[absImportJsPath]){
            importPathAndKeyMap[absImportJsPath] = []
        }
        const importKeyList = importPathAndKeyMap[absImportJsPath]
        // 判断之前是否加入过key
        if(!importKeyList.includes(importKey)){
            importKeyList.push(importKey)
        }
        if(importKey.indexOf("{") >= 0){
            // 用逗号分割变量名
            if(/}$/.test(importKey)){
              // 去除{}
              importKey = importKey.trim().slice(1, -1)
              importKey.split(",").map((varKey:string) => {
                // 判断有没有分号重命名
                if(varKey.indexOf(":") > 0){
                  varKey = varKey.split(":")[1]
                }
                addAllRquireKey(varKey)
              })
            }
          }else{
            // allRequireKeyList.push(importKey.replace("* as", ""))
            addAllRquireKey(importKey.replace("* as", ""))
          }
        return ""
    })
}

/**
 * 增加requirekey
 * @param key 
 */
function addAllRquireKey(key: string): void{
    if(!key){
        return
    }
    // 检查是否存在
    if(allRequireKeyList.includes(key)){
        return
    }
    // 加入列表
    allRequireKeyList.push(key)
}

/** 
 * 增加json依赖文件
*/
export function addDependenceJson(jsonPath: string, miniappRootPath: string): void {
    console.log("addDependenceJson", jsonPath);
    
    // 读取json
    const jsonStr = readFileSync(jsonPath, {encoding: "utf-8"})
    let jsonObj: Record<string, any> = {
    }
    try {
        // json 解析
        jsonObj = JSON.parse(jsonStr) || {}
        // 
    } catch (error) {
        console.log("解析json失败，请检查", jsonPath, error);
    }
    // 当前页面的使用组件配置
    const currentPageUsingComponents = jsonObj.usingComponents || {}
    Object.keys(currentPageUsingComponents).forEach((customTagName: string) => {
        let customComponentPath = currentPageUsingComponents[customTagName]
        // 判断是不是相对路径 还是跟路径
        if(customComponentPath[0] === "/"){
            // 绝对路径 从root 开始算
            customComponentPath = join(miniappRootPath, "." + customComponentPath)
        }else if(customComponentPath[0] === "."){
            // 相对文件路径
            customComponentPath = join(join(jsonPath, "../"), customComponentPath)
        }
        usingComponents[customTagName] = customComponentPath
    })

    console.log("usingComponents", usingComponents);

}

/**
 * 收集依赖的wxml 和 component
 */
export function addDependenceWxmlByPath(wxmlPath: string): void{

}
/**
 * 收集依赖的wxml 和 component
 */
export function addDependenceWxml(
     wxmlPath: string,
     customComponentConfig: CustomComponentConfig,
     importList: ImportTag[]
): void{
    // 处理自定义组件属性
    Object.keys(customComponentConfig).map((tagName) => {
        // 组件简单属性 是否有孩子列表
        const customComponentSimpleProps = customComponentConfig[tagName]
        // 检查之前是否记录过 如果没记录过就增加，记录过就更新
        if(!allCustomComponentConfig[tagName]){
            allCustomComponentConfig[tagName] = customComponentSimpleProps
        }else{
            // 更新
            const oldCustomComponentSimpleProps = allCustomComponentConfig[tagName]
            // 有没有孩子
            oldCustomComponentSimpleProps.hasChildren = oldCustomComponentSimpleProps.hasChildren || customComponentSimpleProps.hasChildren
            // 更新属性列表
            if(oldCustomComponentSimpleProps.attribute){
                oldCustomComponentSimpleProps.attribute = {}
            }
            // 旧的属性
            const oldAttribute = oldCustomComponentSimpleProps.attribute
            // 新的属性
            const newAttribute = customComponentSimpleProps.attribute || {}
            Object.keys(newAttribute).map((key) => {
                // 如果新的属性不存在于旧属性 则加入
                if(!oldAttribute[key]){
                    oldAttribute[key] = newAttribute[key]
                }
            })
        }
    })

    // 先不考虑 处理import的 wxml
    importList.forEach((importTag) => {
        // 检查key
        const importTagKey = importTag.tagName + "~" + importTag.src
        if(allImportKeyList.includes(importTagKey)){
            // 之前已经加入过
            return
        }
        // 加入key
        allImportKeyList.push(importTagKey)
        // 加入 importTag
        allImportList.push(importTag)
    })
}
/**
 * 收集依赖的wxss
 */
export function addDependenceWxss(wxssPath: string): void{
    // 读取wxss文件
    const wxssCode = readFileSync(wxssPath, { encoding: "utf-8" })
    // 分割引用的wxss
    const currentPageWxss = wxssCode.replace(/@import "(.*?)";/, (all, $1) => {
        // import wxss 的绝对路径
        const absImportWxssFilePath = join(join(wxssPath, "../"), $1)
        // 检查是否加入过引用资源列表
        if(importWxssPathList.includes(absImportWxssFilePath)){
            return ""
        }
        // 加入引用资源列表
        importWxssPathList.push(absImportWxssFilePath)
        return ""
    })
    otherWxssStrList.push(currentPageWxss)
}
/**
 * 生成主要页面
 */
export function genMainPage(mainPagePath: string): void{
    // 生成渲染页面js


    // 生成渲染页面json
    // 生成渲染页面wxml
    // 生成渲染页面wxss
    // 生成bast.wxml
}
