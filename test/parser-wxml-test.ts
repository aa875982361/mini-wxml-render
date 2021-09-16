import parserWxml from "../src/parser-wxml"
import * as path from "path"

const testWxmlPath = path.join(__dirname, "../test-file/main.wxml")
const testWxmlRenderJsPath = path.join(__dirname, "../test-file/main.render.js")

parserWxml(testWxmlPath, testWxmlRenderJsPath)