const fs = require("fs")
import * as path from "path"
class File {
  constructor(){
  }
  write(filePath: string, str: string | object  = "", isBeautiful: boolean = false): void{
    // 处理文件路径
    if(filePath.indexOf(".") === 0){
      filePath = path.join(__dirname, "../", filePath)
    }
    // 处理内容 如果是对象转为字符
    if(str && typeof str === "object"){
      // console.log("str", str);
      if(isBeautiful){
        str = JSON.stringify(str, null, 2)
      }else{
        str = JSON.stringify(str)
      }
    }
    // 判断文件路径是否存在 不存在则创建
    if(!fs.existsSync(filePath)){
      const dir = path.dirname(filePath)
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, str, { encoding: "utf-8" })
  }
  // 读取文件
  read(filePath: string, isJson:boolean = true): string | object{
    // 处理文件路径
    if(filePath.indexOf(".") === 0){
      filePath = path.join(__dirname, "../../", filePath)
    }
    // 判断文件是否存在
    if(!fs.existsSync(filePath)){
      return ""
    }
    let result = fs.readFileSync(filePath, { encoding: "utf-8" })
    try{
      result = (result && isJson) ? JSON.parse(result) : result
      return result
    }catch(e){
      return result
    }
  }
  // 判断文件是否存在
  exists(filePath: string): boolean{
    return fs.existsSync(filePath)
  }
  /**
   * 复制文件
   * @param originPath 源文件
   * @param targetPath 目标文件
   */
  copy(originPath: string, targetPath: string): void{
    if(originPath && !this.exists(originPath)){
      console.log("复制的文件不存在");
      return
    }
    this.write(targetPath, this.read(originPath, false))
  }
  handlePath(pathStr?: string){
    if(!pathStr){
      return ""
    }
    return pathStr.split(path.sep).join("/")
  }
}
export default new File()