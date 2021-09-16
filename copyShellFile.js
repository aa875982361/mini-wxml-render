const fs = require("fs")
const path = require("path");

const list = [
    {
        originRelativePath: "./nsc/bin/run", 
        targetRelativePath: "./dist/nsc/bin/run"
    }, 
    {
        originRelativePath: "./nsc/bin/run.cmd", 
        targetRelativePath: "./dist/nsc/bin/run.cmd"
    },
    {
        originRelativePath: "./nsc/package.json", 
        targetRelativePath: "./dist/nsc/package.json"
    }
]

list.map(({originRelativePath, targetRelativePath}) => {
    const originAbsolutePath = path.join(__dirname, originRelativePath)
    const targetAbsolutePath = path.join(__dirname, targetRelativePath)
    // 判断文件路径是否存在 不存在则创建
    if(!fs.existsSync(targetAbsolutePath)){
        const dir = path.dirname(targetAbsolutePath)
        fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(targetAbsolutePath, fs.readFileSync(originAbsolutePath))
    if(originRelativePath.includes("run")){
        console.log("targetAbsolutePath", targetAbsolutePath);
        // 赋予脚本执行权限
        fs.chmodSync(targetAbsolutePath, 0o777)
    }
})
