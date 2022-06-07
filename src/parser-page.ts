import * as path from "path"
import * as fs from "fs"
import parserWxml from "./parser-wxml"
import genRenderPage from "./gen-render-page"
import file from "./utils/file"
import { addDependenceJsByPath, addDependenceJson, addDependenceWxml, addDependenceWxss, genMainPage } from "./gen-main-render-page"
const babel = require("@babel/core");

// 目标文件名
let targeFileName = "main"
// wxml 文件位置
let wxmlPath = ""
// json 文件位置
let jsonPath = ""
// wxss 文件位置
let wxssPath = ""
// 页面js 文件位置
let pageJsPath = ""
// 运行时文件位置
const runtimeJsPath = path.join(__dirname, "./runtime-code/page-runtime.js")

// dist-page 的文件目录
let distPagePath = ""
// 目标js文件位置
let targetJsPath = ""
// 转换es5 之后文件位置
let targetEs5JsPath = ""

let appJsonPath = "" // 小程序项目app.json的文件路径
let miniappRootPath = "" // 小程序项目根目录

let allRequireKeyList:string[] = [] // 外部导入的变量名，可以全局使用

interface GenPageConfig {
  pageJsPath: string,
  pageWxmlPath?: string,
  pageJsonPath?: string,
  pageWxssPath?: string,
  isBuildImportResource?: boolean
}
/**
 * 运行配置
 */
interface RunConfig {
  distPagePath: string, // dist
  needGenPageList: GenPageConfig[],
  mainPage?: string
}

// tslint:disable-next-line:cognitive-complexity
export default function main(runConfig:RunConfig): void{
  if(!runConfig){
    // 设置默认路径
    throw new Error("please input runConfig")
  }else{
    // 更新dist 文件夹目标位置
    distPagePath = runConfig.distPagePath || distPagePath
  }
 
  const mainPage = runConfig.mainPage
  // 需要打包的页面列表
  const configList = runConfig.needGenPageList || []
  if(!Array.isArray(configList)){
    console.log("配置文件内容有问题请检查，当前配置文件是:" + JSON.stringify(runConfig))
    return
  }
  const genPagePromiseList = configList.map((config): Promise<string> => {
    return new Promise((resolve, reject): void=>{
      // 初始化数据
      allRequireKeyList = []
      // 读取文件配置
      // const config = file.read(configFilePath) || {}
      if(config.pageJsPath){
        // console.log("configFilePath", config.pageJsPath)
        if(!config.pageWxmlPath){
          config.pageWxmlPath = config.pageJsPath.replace(/js$/, "wxml")
        }
        if(!config.pageWxssPath){
          config.pageWxssPath = config.pageJsPath.replace(/js$/, "wxss")
        }
        if(!config.pageJsonPath){
          config.pageJsonPath = config.pageJsPath.replace(/js$/, "json")
        }
        pageJsPath = config.pageJsPath
        wxmlPath = config.pageWxmlPath
        wxssPath = config.pageWxssPath
        jsonPath = config.pageJsonPath
        // 获取小程序根目录
        if(!miniappRootPath){
          // 获得小程序页面根路径
          let _miniappRootPath = path.join(pageJsPath, "../")
          // console.log("_miniappRootPath.indexOf(\"/\")", _miniappRootPath.indexOf("/"))
          let maxFloor = 40
          while(_miniappRootPath.indexOf("/", 1) > 0  && maxFloor-- > 0){
            // 判断目录下是否存在app.json文件
            const tempAppJsonPath = path.join(_miniappRootPath, "./app.json")
            // console.log("tempAppJsonPath", tempAppJsonPath)
            if (file.exists(tempAppJsonPath)) {
              appJsonPath = tempAppJsonPath
              break
            } else {
              _miniappRootPath = path.join(_miniappRootPath, "../")
            }
          }
          // console.log("_miniappRootPath", _miniappRootPath)
          miniappRootPath = _miniappRootPath
        }

      }else{
        throw new Error("配置错误 需要传入编译的页面js路径")
      }
      // 处理wxml
      const { renderFunctionStr: wxmlJsCode = "" , customComponentConfig = {}, importList = []} = parserWxml(wxmlPath, "", miniappRootPath)
      const runtimeJsCode = fs.readFileSync(runtimeJsPath, { encoding: "utf-8" })
      let pageJsCode:string = fs.readFileSync(pageJsPath, { encoding: "utf-8" })

      // 处理原本页面js 去除一些不需要的代码 比如外部引用的代码，
      pageJsCode = handleOriginPageJs(pageJsCode, allRequireKeyList, config.isBuildImportResource)

      const allJsCode = `
function run({page${allRequireKeyList.length > 0 ? (',' + allRequireKeyList.join(",")):''}}){
  /** 渲染函数 */
  ${wxmlJsCode}
  /** 页面运行时函数 */
  ${runtimeJsCode}
  /** 原有页面处理逻辑 */
  ${pageJsCode}
}
module.exports = {
  run
}
      `
      // 根据目标页面的文件路径获得相对的页面路径 dist/page/index.js => page/index
      targeFileName = pageJsPath.replace(miniappRootPath, "").split(path.sep).slice(-1).join("").replace(/\.js$/, "")
      // 目标js文件位置
      targetJsPath = path.join(distPagePath, `js/${targeFileName}.js`)
      // 转换es5 之后文件位置
      targetEs5JsPath = path.join(distPagePath, `js/${targeFileName}.es5.js`)
      // 检查文件路径是否存在 不存在则创建
      checkFilePath(targetJsPath)
      checkFilePath(targetEs5JsPath)

      // 写入目标原始js 是es6 语法的
      file.write(targetJsPath, allJsCode)
      const {code} = babel.transformSync(allJsCode, {
        "presets": ["@babel/preset-env"]
      })
      // 写入es5 语法的js文件
      file.write(targetEs5JsPath, code)
      // console.log("转换es5 完成");
      try {
        // 如果是多个页面编译为一个页面 那只需要收集wxml依赖的组件
        if(mainPage){
          // 记录依赖的js
          addDependenceJsByPath(pageJsPath)
          // 记录依赖的json
          addDependenceJson(jsonPath, miniappRootPath)
          // 记录依赖wxml
          addDependenceWxml(wxmlPath, customComponentConfig, importList)
          // 记录依赖wxs
          addDependenceWxss(wxssPath)
        }else{
          // 生成单个页面的承载页面
          genRenderPage(pageJsPath, targetEs5JsPath, customComponentConfig, importList)
        }
        // console.log("生成承载页面完成");
        resolve("成功")
      } catch (error) {
        console.log("生成承载页面出错", error)
        reject("生成承载页面出错")
      }
      return
    })
  })

  // 全部页面编译完之后 生成一个承载页
  Promise.all(genPagePromiseList).then(() => {
    // 全部编译成功
    // 如果是多个页面编译为一个页面的话，生成
    if(mainPage){
      genMainPage(mainPage)
    }
  })
}


// ------------------ js 工具函数 暂时没有抽离  -------------------------------------

/**
 * 处理原本页面代码
 * @param code 原有代码
 * @returns 处理后的代码
 */
function handleOriginPageJs(code: string, allRequireKeyList: string[], isBuildImportResource?: boolean): string{

  // 注释原本引用
  code = code.replace(/var (.*?) = require\((.*?)\);/g, (all, requireKey): string => {
    allRequireKeyList.push(requireKey)
    return `/** ${all} */`
  })
  // 注释import 的引用
  code = code.replace(/import (.*?) from (?:\'|\")(.*?)(?:\'|\")/g, (all, importKey): string => {
    if(importKey.indexOf("{") >= 0){
      // 用逗号分割变量名
      if(/}$/.test(importKey)){
        // 去除{}
        importKey = importKey.trim().slice(1, -1)
        importKey.split(",").map((varKey:string) => {
          // 判断有没有分号重命名
          if(varKey.indexOf(":") === -1){
            allRequireKeyList.push(varKey)
          }else{
            allRequireKeyList.push(varKey.split(":")[1])
          }
        })
      }
    }else{
      allRequireKeyList.push(importKey.replace("* as", ""))
    }
    return `/** ${all} */`
  })
  return code
}

/**
 * 检查文件路径是否存在，如果不存在则创建
 * @param filePath
 * @param basePath
 */
function checkFilePath(filePath:string = "", basePath:string = ""): void{
  const isRelateivePath = filePath.indexOf(".") === 0
  if(isRelateivePath){
    filePath = path.join(basePath || __dirname, "../"+filePath)
  }
  // 判断文件路径是否存在 不存在则创建
  if(!fs.existsSync(filePath)){
    const dir = path.dirname(filePath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, "")
  }
}