import parserWxml from "../src/parser-wxml"
import * as path from "path"

/** 需要编译的wxml文件 */
const testWxmlPath = path.join(__dirname, "../test-file/main.wxml")
/** wxml编译完得到的文件存放地址 不存在会创建，存在会覆盖 */
const testWxmlRenderJsPath = path.join(__dirname, "../test-file/main.render.js")

parserWxml(testWxmlPath, testWxmlRenderJsPath)