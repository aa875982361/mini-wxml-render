import * as path from "path"
import * as fs from "fs"
import parserWxml from "./parser-wxml"
import genRenderPage from "./gen-render-page"
import file from "./utils/file"
const babel = require("@babel/core");

// 目标文件名
let targeFileName = "main"
// wxml 文件位置
let wxmlPath = ""
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

interface GenPageConfig {
  pageJsPath: string
}
/**
 * 运行配置
 */
interface RunConfig {
  distPagePath: string, // dist
  needGenPageList: GenPageConfig[],
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
 
  // 需要打包的页面列表
  const configList = runConfig.needGenPageList || []
  if(!Array.isArray(configList)){
    console.log("配置文件内容有问题请检查，当前配置文件是:" + JSON.stringify(runConfig))
    return
  }
  configList.map((config: any): Promise<string> => {
    return new Promise((resolve, reject): void=>{
      // 读取文件配置
      // const config = file.read(configFilePath) || {}
      if(config.pageJsPath){
        // console.log("configFilePath", config.pageJsPath)
        if(!config.pageWxmlPath){
          config.pageWxmlPath = config.pageJsPath.replace(/js$/, "wxml")
        }
        pageJsPath = config.pageJsPath
        wxmlPath = config.pageWxmlPath
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

      }
      // 处理wxml
      const { renderFunctionStr: wxmlJsCode = "" , customComponentConfig = {}, importList = []} = parserWxml(wxmlPath, "", miniappRootPath)
      const runtimeJsCode = fs.readFileSync(runtimeJsPath, { encoding: "utf-8" })
      let pageJsCode:string = fs.readFileSync(pageJsPath, { encoding: "utf-8" })

      // 处理原本页面js 去除一些不需要的代码 比如外部引用的代码，
      pageJsCode = handleOriginPageJs(pageJsCode)

      const allJsCode = `
function run({page}){
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
        // 生成承载页面出错
        genRenderPage(pageJsPath, targetEs5JsPath, customComponentConfig, importList)
        // console.log("生成承载页面完成");
      } catch (error) {
        // console.log("生成承载页面出错", error)
        reject("生成承载页面出错")
      }
      return
    })
  })
}


// ------------------ js 工具函数 暂时没有抽离  -------------------------------------

/**
 * 处理原本页面代码
 * @param code 原有代码
 * @returns 处理后的代码
 */
function handleOriginPageJs(code: string): string{
  // 注释原本引用
  code = code.replace(/var (.*?) = require\((.*?)\);/g, (all): string => {
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