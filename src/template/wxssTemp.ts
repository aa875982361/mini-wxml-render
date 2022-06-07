/**
 * 生成渲染页面的wxss
 */
import * as path  from "path"
/**
 * 生成渲染页面的wxsspath
 * @param wxssPath wxss 的文件路径
 * @param importWxssPathList 引入wxss 的路径列表
 * @param otherWxssStrList 其他wxss 没考虑相同的情况，如果相同会覆盖
 */
export function genPageWxss(wxssPath: string, importWxssPathList: string[], otherWxssStrList: string[]): string {
    console.log("importWxssPathList", importWxssPathList);
    const wxssDirPath = path.join(wxssPath, "../")
    // console.log("otherWxssStrList", otherWxssStrList);
    const importStrList = importWxssPathList.map((dependenceWxssAbsPath) => {
        // 转换相对路径
        let dependenceWxssRelativePath = path.relative(wxssDirPath, dependenceWxssAbsPath)
        // 如果不是相对路径 就加个./
        if(dependenceWxssRelativePath.indexOf(".") !== 0){
            dependenceWxssRelativePath = "./" + dependenceWxssRelativePath
        }
        return `@import "${dependenceWxssRelativePath}";`
    })
    return `
    ${importStrList.join("\n")}
    ${otherWxssStrList.join("\n")}
    `
}