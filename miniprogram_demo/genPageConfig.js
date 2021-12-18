const fs = require("fs")
const path = require("path")

// 读取文件夹下的列表
let res = fs.readdirSync(path.join(__dirname, "./miniprogram/page/component/pages"))
res = res.filter(str => str.indexOf("-v2") === -1 && str !== "base.wxml")
res = res.map(compName => {
    return {
        "pageJsPath": `./miniprogram/page/component/pages/${compName}/${compName}.js`
    }
})
const config = {
    "distPagePath": "./dist-page",
    "needGenPageList": res
}
console.log("config", config);
fs.writeFileSync("./gen-page-config.json", JSON.stringify(config, null, 2))
