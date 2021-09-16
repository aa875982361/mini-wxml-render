/**
 * 测试生成承载页面逻辑
 */
import genRenderPage from "../src/gen-render-page"
import * as path from "path"
/** 需要转换的页面js */
const testJsPath = path.join(__dirname, "../test-file/index/index.js")
/** 需要转换页面的wxml和js编译到一起的渲染js逻辑 */
const renderJsPath = path.join(__dirname, "../test-file/main.render.js")

genRenderPage(testJsPath, renderJsPath)