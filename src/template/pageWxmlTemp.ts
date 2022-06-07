/**
 * 生成渲染页面的wxml
 */

import * as path from "path"
import file from "../utils/file"
import { vdomsKey } from "../global";

/**
 * 生成渲染页面的wxml
 * @param wxmlPath 
 * @returns 
 */
export function genPageWxml(wxmlPath: string, baseWxmlPath: string): string{
    if(baseWxmlPath.indexOf(".") !== 0){
        // 计算相对路径
        baseWxmlPath = path.relative(path.join(wxmlPath, "../"), baseWxmlPath)
        // 处理路径
        baseWxmlPath = file.handlePath(baseWxmlPath)
    }
    return `
<import src="${baseWxmlPath}"/>
<template is="container_0" data="{{${vdomsKey}: ${vdomsKey}, cid: 0}}"></template>
`
}