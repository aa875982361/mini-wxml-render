# mini-wxml-render
# 将小程序页面编译为js，用另外一个页面渲染
## 目的
将wxml文件编译成js，并组合页面js，变成一份渲染js， 并通过一个承载页面运行js渲染出原本的页面。
## 目前已做
1. 编译wxml为渲染模板，并收集页面数据引用到的属性名，以及事件名
2. 构建渲染wxml,可以根据虚拟dom树渲染页面
3. 构建运行时的Page方法，连接内部需要渲染的页面和外部承载页面
4. 根据页面数据变化，找到影响的渲染节点属性，优化交互性能。

## 快速体验
```javascript
npm run start
```
使用开发者工具打开小程序：`example-mini`
![小程序主界面](./docs/main-mini.png)
进入主页面后可以按钮进入原生页面，或者进入承载页面

## 命令行编译
通过命令行快速编译页面，生成一个承载页
```shell
npm install -g mini-wxml-render
# 创建一个gen-page-config.json文件
mini-wxml-render genVmPage ./gen-page-config.json
```
gen-page-config.json 示例如下：
```json
{
  "distPagePath": "./dist-page", // wxml编译后的js文件存放位置
  "version": "1.0.0", // 版本号
  "needGenPageList": [
    {
      "pageJsPath": "./example-mini/pages/calculate/calculate.js" // 需要编译的页面
    }
  ]
}

```
## Change Log

### 2021-09-16
* 完成功能代码抽离，并上传
* 发布到npm 并增加使用说明

### 2021-09-14
* 处理内部页面直接修改内部数据，并setData数据地址的问题

### 2021-09-13
* 设定生产环境，缩短虚拟dom的属性名称
* 思考串行运行setData的可行性，并实际测试效果，效果不理想，增加了交互耗时

### 2021-09-10
* 增加对wxForItem对象使用到的属性名进行监听

### 2021-09-10
* 编译时收集wxForItem对象用到的属性名

### 2021-09-08
* 优化首次渲染的逻辑，page.onReader 和 pageOnShow 放在setData回调中执行

### 2021-09-06
* 抽离最小化更新逻辑到page-diff.js 文件

### 2021-08-23
* 处理wxfor下的节点 数据有更新则检查全部的更新

### 2021-08-19
* 增加page.data数据监听，在属性变化之后通知影响到的节点更新特定key（XR：300ms=> 100ms）

### 2021-08-17
* 收集页面渲染使用到的数据属性，排除wxs,wxForItem

### 2O21-08-13
* 减少Object.keys 的使用，用空间换时间，减少运行时间

### 2021-08-11
* 完善wx:for的初次渲染和再次渲染逻辑

### 2021-07-30
* 区分初次渲染和再次渲染，只处理节点会更新的属性，不进行整颗渲染树的对比（XR: 1000ms => 300ms）

### 2021-07-08
* 深度对比两个虚拟dom树，找出更新的属性，多层属性名拼接，最后setData({"xxxx.xxx.xxx": "xxx"}) (XR: 1000ms)

### 2021-06-22
* 处理dataSet的设置值，和取值

### 2021-06-15
* 处理 wx:for 逻辑

### 2021-06-08
* 处理wx:if wx:elif wx:else 逻辑

### 2021-06-06
* 增加事件代理，将全部事件代理到同一个function，通过id+事件名找到真正需要触发的函数名

### 2021-06-05
* 增加生成承载页逻辑
### 2021-06-04
* 增加初步解析wxml逻辑
### 2021-05-29
* 思考通过承载页面渲染内部页面方案

## 参考
1. (taro 编译产物的 base.wxml)[https://github.com/nervjs/taro]
2. (vue3 静态节点不处理，只处理有数据变更的节点)[https://github.com/vuejs/vue]

