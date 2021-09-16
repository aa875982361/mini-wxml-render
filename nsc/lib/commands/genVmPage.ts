import { Command, flags } from '@oclif/command'
import path = require("path")
import fs = require("fs")
import file from "../../../src/utils/file"
import parsePage from "../../../src/parser-page"

export default class Compile extends Command {
  static description = '解析真实页面成为一个虚拟页面'

  static examples = [
    `$ nsc genVmPage ./gen-page-config.json`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'configPath' }]

  async run() {
    const { args, flags } = this.parse(Compile)
    if (!args.configPath) {
      console.log("Please specify configPath.")
      return
    }

    const configPath = this.getAbsPath(args.configPath)
    // console.log("configPath", configPath);
    const config: any = file.read(configPath)
    if(!config){
      console.log("Please check configFile.");
      return
    }
    config.distPagePath = this.getAbsPath(config.distPagePath)
    config.needGenPageList.map((item:any) => {
      item.pageJsPath = this.getAbsPath(item.pageJsPath)
    })
    // console.log("config", config);
    parsePage(config as any)

  }

  public getAbsPath(p: string = ""): string {
    if(p && p.indexOf("/") === 0){
      return p
    }
    return path.resolve(path.join(process.cwd(), p))
  }
}
