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
  const loader = require("../loader")
  const createVMFromArrayBuffer = loader.createVMFromArrayBuffer || loader.createImageFromArrayBuffer
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
        const iv = options.iv || ""
        this.isLoadPre = true
        const oldSetData = this.setData
        this.setData = function(obj, callback){
          console.log("obj", obj);
          oldSetData.call(this, obj, callback)
        }
        wx.showLoading({
          title: '加载中',
        })
        if(iv){
          // 初始化虚拟机
          this.initVm()
          // 查看是否有缓存
          this.initPreBinaryUrl()
          return
        }
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
      /**
     * 获取缓存数据
     */
    initPreBinaryUrl(){
      const promise = this.getStoragePromise(this.pagePath)
      promise.then(res => {
        console.log("getStorage result",  res);
        // 设置上一个binary的Url 为
        this.preBinaryUrl = res
        // 如果这个时候已经存在最新的  则不会去拿上一个binary
        if(this.isUnloadInPage || this.nextBinaryUrl){
          return
        }
        this.getPreBinaryPromise = this.getBinaryByUrl(this.preBinaryUrl)
  
        if(this.isLoadPre){
          this.getPreBinaryPromise.then(data => {
            this.runVmCode(data)
          })
        }
      })
    },
    initVm(){
      const ctx = {}
      this.ctx = ctx;
      const oldSetData = this.setData
      this.setData = function(obj, callback){
        console.log("obj", typeof obj,  obj);
        oldSetData.call(this, obj, callback)
      }
      wx.cloud.callFunction({
        name: "getStaticData",
        data: {
          name: this.pagePath,
          version: config?.config?.version || "1.0.1",
          pagePath: this?.route || "",
        },
      }).then((res) => {
        const binaryUrl = res?.result?.data || ""
        console.log("binaryUrl", binaryUrl, res)
        if (this.isUnloadInPage || !binaryUrl) {
          return
        }
        // 只加载旧版本的模式
        if(this.isLoadPre && this.getPreBinaryPromise){
          // 将当前的二进制二进制文件链接存入缓存
          wx.setStorage({
            key: this.pagePath,
            data: binaryUrl
          })
          if(this.preBinaryUrl !== binaryUrl){
            const query = this.options && Object.keys(this.options).map((key)=>{
              return key+"="+this.options[key]
            }).join("&")
            // 刷新当前页
            wx.redirectTo({
              url: "/" + this.route + "?" + query
            })
          }
          return
        }
        // 有二进制文件url
        this.nextBinaryUrl = binaryUrl
        // 判断是否和旧的二进制文件相同
        let nextPromise =  Promise.resolve()
        if(this.preBinaryUrl === binaryUrl && this.getPreBinaryPromise){
          nextPromise = this.getPreBinaryPromise
        }else{
          nextPromise = this.getBinaryByUrl(binaryUrl)
          // 将当前的二进制二进制文件链接存入缓存
          wx.setStorage({
            key: this.pagePath,
            data: binaryUrl
          })
        }
  
        nextPromise.then(data => {
          // 得到的是二进制流
          this.runVmCode(data)
        })
      })
    },
    // 将storage 获取改为promise
    getStoragePromise(key){
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key,
          success: function(value){
            console.log("getStorage key, value", key, value);
            resolve(value && value.data)
          },
          fail: function(err){
            console.log("getStorage error", err);
            reject(err)
          }
        })
      })
    },
  
    // 根据url 回去二进制流
    getBinaryByUrl(url){
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          responseType: "arraybuffer",
          success: (result)=> {
            console.log("获取二进制流成功")
            // 获得二进制流
            const binaryData = result?.data
            console.log("binaryData", binaryData)
            resolve(binaryData)
          },
          fail: (error) => {
            console.error("获取文件出错了")
            reject(error)
          },
        })
      })
    },
    // 运行二进制流
    runVmCode(data){
      if(!data){
        return
      }
      const vm = createVMFromArrayBuffer(data, this.ctx)
      // console.log("vm", vm);
      vm.ctx = {
        wx,
        console,
        page: this,
        Object,
        JSON,
        Array,
        Number,
        String,
        Function,
        Reflect,
        Date,
        Symbol,
        RegExp,
        Promise,
        setTimeout,
        setInterval,
      }
      vm.run()
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