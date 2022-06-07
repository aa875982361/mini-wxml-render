/**
 * 生成渲染页面的json配置
 * 配置使用到的组件
 */
 import * as path from "path"

/**
 * 生成渲染页面的json
 * @param jsonPath json文件路径
 * @param usingComponents 使用到的组件
 */
export function genPageJson(jsonPath: string, usingComponents: any){
    console.log("usingComponents", usingComponents);
    const jsonDirPath = path.join(jsonPath, "../")
    // 遍历使用到的组件，将绝对路径转化为相对路径
    Object.keys(usingComponents).forEach((compName) => {
        // 组件的绝对路径
        const componentAbsPath = usingComponents[compName]
        // 计算出相对路径
        const componentRelativePath = path.relative(jsonDirPath, componentAbsPath)
        // 替换为相对路径
        usingComponents[compName] = componentRelativePath
    })
    // 不考虑动态组件先


    return `
{
  "usingComponents": ${JSON.stringify(usingComponents, null, 2)}
}
`
}