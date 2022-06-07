import * as path from "path"
import { vdomsKey } from "../global";
import { RequirePathAndKeyMap, ImportPathAndKeyMap } from "../gen-main-render-page";
import { getOnlyShortKeyName } from "../utils/util";

/**
 * 生成渲染页面js
 * @param requirePathAndKeyMap require 依赖的文件和命名
 * @param importPathAndKeyMap import 依赖的文件和命名
 * @param requireKeyList 虚拟页使用的变量名
 * @returns 
 */
export function genPageJs(jsPath:string, requirePathAndKeyMap: RequirePathAndKeyMap, importPathAndKeyMap: ImportPathAndKeyMap, requireKeyList: string[]): string{
    const requireStrKeyInjectVm = requireKeyList.join(",")
    return `
    const app = getApp();
    // 引入require的资源
    ${genRequireOrImportJsStr(jsPath, requirePathAndKeyMap, true)}
    // 引入import的资源
    ${genRequireOrImportJsStr(jsPath, importPathAndKeyMap, false)}
    
    Page({
      data: {
        ${vdomsKey}: []
      },
      onLoad(options) {
        // 这里获取请求路径
        const originPath = options.originPath || ""
        this.isLoadPre = true
        const oldSetData = this.setData
        this.setData = function(obj, callback){
          console.log("obj", obj);
          oldSetData.call(this, obj, callback)
        }
        wx.showLoading({
          title: '加载中',
        })
        this.runJsCode(originPath)
      },
      onShow(){
        console.log("onshow");
      },
      onUnload(){
      },
      // 运行
      runJsCode(jsPath){
        // 如果没传 就白屏
        if(!jsPath){
            wx.hideLoading()
            return
        }
        // 判断是不是相对文件路径
        if(jsPath.indexOf(".") !== 0){
            jsPath = "./" + jsPath
        }
        const innerPage = require(jsPath)
        innerPage.run({
          app,
          page: this,
          ${requireStrKeyInjectVm}
        })
      },
      toOriginPage(){
        wx.navigateTo({
          url: '/test/index',
        })
      }
    })
    
    `
}
/**
 * 生成请求js的str
 * @param requirePathAndKeyMap 
 */
function genRequireOrImportJsStr(jsPath: string, requirePathAndKeyMap: RequirePathAndKeyMap, isRequire: boolean = false): string {
    const jsDirPath = path.join(jsPath, "../")
    console.log("jsDirPath", jsDirPath);
    
    return Object.keys(requirePathAndKeyMap).map((requireJspath) => {
        console.log("requireJspath", requireJspath);
        
        // key 列表
        const keyList = requirePathAndKeyMap[requireJspath]
        // 获取相对文件路径
        let relativeJsPath = path.relative(jsDirPath, requireJspath)
        // 如果不是以.开头 就是同一文件夹下，需要加个./ 相对文件路径
        if(relativeJsPath.indexOf(".") !== 0){
            relativeJsPath = "./" + relativeJsPath
        }
        const onlyKey = getOnlyShortKeyName()
        const requireStr = isRequire ? `var ${onlyKey}  = require("${relativeJsPath}");` : `import ${onlyKey}  from "${relativeJsPath}";`
        return `
            ${requireStr}
            ${keyList.map((key) => {
                return `var ${key} = ${onlyKey};`
            }).join("\n")}
        `
    }).join("\n")
}