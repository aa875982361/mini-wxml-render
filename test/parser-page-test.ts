import parserPage from "../src/parser-page"
import * as path from "path"

// 编译页面配置
const config = {
    // 要转换页面的wxml和js编译到一起之后渲染js存在的文件夹路径
    "distPagePath": path.join(__dirname, "../test-file/dist-page"),
    "version": "1.0.0",
    "needGenPageList": [
        {
            // 需要转换的页面js 会根据这个js 找到对应的wxml wxss json
            "pageJsPath": path.join(__dirname, "../test-file/mini/pages/logs/logs.js")
        }
    ]
}
  
parserPage(config)