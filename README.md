# mini-wxml-render
# 将小程序页面编译为js，用另外一个页面渲染
## 目的
将wxml文件编译成js，并组合页面js，变成一份渲染js， 并通过一个承载页面运行js渲染出原本的页面。
## 目前已做
1. 编译wxml为渲染模板，并收集页面数据引用到的属性名，以及事件名
2. 构建渲染wxml,可以根据虚拟dom树渲染页面
3. 构建运行时的Page方法，连接内部需要渲染的页面和外部承载页面
4. 优化内部页面数据变化引起渲染变化的交互性能。

## 快速体验
```javascript
npm run start
```
进入小程序初始页面，点击用户头像，即可进入承载页面`/pages/logs-v2/logs`
## 参考
1. (taro 编译产物的 base.wxml)[https://github.com/nervjs/taro]
2. (vue3 静态节点不处理，只处理有数据变更的节点)[https://github.com/vuejs/vue]

