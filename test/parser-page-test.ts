import parserPage from "../src/parser-page"
import * as path from "path"

const config = {
    "distPagePath": path.join(__dirname, "../test-file/dist-page"),
    "version": "1.0.0",
    "needGenPageList": [
      {
        "pageJsPath": path.join(__dirname, "../test-file/mini/pages/logs/logs.js")
      }
    ]
}
  
parserPage(config)