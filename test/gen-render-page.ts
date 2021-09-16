import genRenderPage from "../src/gen-render-page"
import * as path from "path"

const testJsPath = path.join(__dirname, "../test-file/index/index.js")
const renderJsPath = path.join(__dirname, "../test-file/main.render.js")

genRenderPage(testJsPath, renderJsPath)