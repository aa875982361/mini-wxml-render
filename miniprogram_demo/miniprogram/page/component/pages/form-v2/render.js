"use strict";

var _excluded = ["wxIf", "wxElif", "wxElse", "wxFor", "wxForIndex", "wxForItem", "wxForVarNameList"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

function run(_ref) {
  var page = _ref.page;

  /** 渲染函数 */
  var wxsMap = {};
  var pageWxs = {};
  var uidEventHandlerFuncMap = {
    "586_submit": {
      "value": "formSubmit",
      "isCatch": true
    },
    "586_reset": {
      "value": "formReset",
      "isCatch": true
    }
  };
  var templateVDomCreateList = [{
    "tagName": "pure-view",
    "attributes": [{
      "key": "class",
      "value": "container"
    }],
    "children": [{
      "tagName": "template",
      "attributes": [{
        "key": "is",
        "value": "head"
      }, {
        "key": "data",
        "value": function value(data) {
          var res = "";

          try {
            res = {
              title: 'form'
            };
          } catch (e) {
            console.warn("\u6267\u884C\uFF1A{title:'form'}\uFF0C\u5931\u8D25", e === null || e === void 0 ? void 0 : e.message);
          }

          return res;
        }
      }],
      "children": [],
      "uid": "582"
    }, {
      "tagName": "pure-view",
      "attributes": [{
        "key": "class",
        "value": "page-body"
      }],
      "children": [{
        "tagName": "form",
        "attributes": [],
        "children": [{
          "tagName": "pure-view",
          "attributes": [{
            "key": "class",
            "value": "page-section page-section-gap"
          }],
          "children": [{
            "tagName": "pure-view",
            "attributes": [{
              "key": "class",
              "value": "page-section-title"
            }],
            "children": [{
              "content": "switch",
              "uid": "591"
            }],
            "uid": "590"
          }, {
            "tagName": "switch",
            "attributes": [{
              "key": "name",
              "value": "switch"
            }],
            "children": [],
            "uid": "593"
          }],
          "uid": "588"
        }, {
          "tagName": "pure-view",
          "attributes": [{
            "key": "class",
            "value": "page-section page-section-gap"
          }],
          "children": [{
            "tagName": "pure-view",
            "attributes": [{
              "key": "class",
              "value": "page-section-title"
            }],
            "children": [{
              "content": "radio",
              "uid": "599"
            }],
            "uid": "598"
          }, {
            "tagName": "radio-group",
            "attributes": [{
              "key": "name",
              "value": "radio"
            }],
            "children": [{
              "tagName": "label",
              "attributes": [],
              "children": [{
                "tagName": "radio",
                "attributes": [{
                  "key": "value",
                  "value": "radio1"
                }],
                "children": [],
                "uid": "604"
              }, {
                "content": "选项一",
                "uid": "605"
              }],
              "uid": "603"
            }, {
              "tagName": "label",
              "attributes": [],
              "children": [{
                "tagName": "radio",
                "attributes": [{
                  "key": "value",
                  "value": "radio2"
                }],
                "children": [],
                "uid": "608"
              }, {
                "content": "选项二",
                "uid": "609"
              }],
              "uid": "607"
            }],
            "uid": "601"
          }],
          "uid": "596"
        }, {
          "tagName": "pure-view",
          "attributes": [{
            "key": "class",
            "value": "page-section page-section-gap"
          }],
          "children": [{
            "tagName": "pure-view",
            "attributes": [{
              "key": "class",
              "value": "page-section-title"
            }],
            "children": [{
              "content": "checkbox",
              "uid": "616"
            }],
            "uid": "615"
          }, {
            "tagName": "checkbox-group",
            "attributes": [{
              "key": "name",
              "value": "checkbox"
            }],
            "children": [{
              "tagName": "label",
              "attributes": [],
              "children": [{
                "tagName": "checkbox",
                "attributes": [{
                  "key": "value",
                  "value": "checkbox1"
                }],
                "children": [],
                "uid": "621"
              }, {
                "content": "选项一",
                "uid": "622"
              }],
              "uid": "620"
            }, {
              "tagName": "label",
              "attributes": [],
              "children": [{
                "tagName": "checkbox",
                "attributes": [{
                  "key": "value",
                  "value": "checkbox2"
                }],
                "children": [],
                "uid": "625"
              }, {
                "content": "选项二",
                "uid": "626"
              }],
              "uid": "624"
            }],
            "uid": "618"
          }],
          "uid": "613"
        }, {
          "tagName": "pure-view",
          "attributes": [{
            "key": "class",
            "value": "page-section page-section-gap"
          }],
          "children": [{
            "tagName": "pure-view",
            "attributes": [{
              "key": "class",
              "value": "page-section-title"
            }],
            "children": [{
              "content": "slider",
              "uid": "633"
            }],
            "uid": "632"
          }, {
            "tagName": "slider",
            "attributes": [{
              "key": "value",
              "value": "50"
            }, {
              "key": "name",
              "value": "slider"
            }, {
              "key": "showValue",
              "value": true
            }],
            "children": [],
            "uid": "635"
          }],
          "uid": "630"
        }, {
          "tagName": "pure-view",
          "attributes": [{
            "key": "class",
            "value": "page-section"
          }],
          "children": [{
            "tagName": "pure-view",
            "attributes": [{
              "key": "class",
              "value": "page-section-title"
            }],
            "children": [{
              "content": "input",
              "uid": "641"
            }],
            "uid": "640"
          }, {
            "tagName": "pure-view",
            "attributes": [{
              "key": "class",
              "value": "weui-cells weui-cells_after-title"
            }],
            "children": [{
              "tagName": "pure-view",
              "attributes": [{
                "key": "class",
                "value": "weui-cell weui-cell_input"
              }],
              "children": [{
                "tagName": "pure-view",
                "attributes": [{
                  "key": "class",
                  "value": "weui-cell__bd"
                }],
                "children": [{
                  "tagName": "input",
                  "attributes": [{
                    "key": "class",
                    "value": "weui-input"
                  }, {
                    "key": "name",
                    "value": "input"
                  }, {
                    "key": "placeholder",
                    "value": "这是一个输入框"
                  }],
                  "children": [],
                  "uid": "649"
                }],
                "uid": "647"
              }],
              "uid": "645"
            }],
            "uid": "643"
          }],
          "uid": "638"
        }, {
          "tagName": "pure-view",
          "attributes": [{
            "key": "class",
            "value": "btn-area"
          }],
          "children": [{
            "tagName": "button",
            "attributes": [{
              "key": "type",
              "value": "primary"
            }, {
              "key": "formType",
              "value": "submit"
            }],
            "children": [{
              "content": "Submit",
              "uid": "658"
            }],
            "uid": "657"
          }, {
            "tagName": "button",
            "attributes": [{
              "key": "formType",
              "value": "reset"
            }],
            "children": [{
              "content": "Reset",
              "uid": "661"
            }],
            "uid": "660"
          }],
          "uid": "655"
        }],
        "uid": "586"
      }],
      "uid": "584"
    }, {
      "tagName": "template",
      "attributes": [{
        "key": "is",
        "value": "foot"
      }],
      "children": [],
      "uid": "666"
    }],
    "uid": "580"
  }];
  var dataKeys = ["list", "item", "theme", "platform", "position", "showCanvas", "frameHeight", "frameWidth", "width", "height", "src", "videoSrc", "result", "canIUse", "items", "latitude", "longitude", "editorHeight", "placeholder", "isIOS", "keyboardHeight", "toolBarHeight", "safeHeight", "formats"];
  var pageWxsObj = {};
  var pageWxsObjKeys = []; // 外部代理数据对象

  var renderProxyData = {}; // 真实数据对象

  var realData = {};
  Object.keys(pageWxs).map(function (key) {
    // 执行函数 构建wxs对象
    if (pageWxs[key] && typeof wxsMap[pageWxs[key]] === "function") {
      pageWxsObj[key] = wxsMap[pageWxs[key]]();

      if (pageWxsObjKeys.indexOf(key) === -1) {
        pageWxsObjKeys.push(key);
      }
    }
  });
  /**
   * 根据字符构建正则
   */

  function getRegExp(str, tag) {
    return new RegExp(str, tag);
  }
  /**
   * 处理事件 this指向为pageObj 是内部页面的方法和数据
   */


  function eventHandler(event) {
    // console.log("event", event);
    // 如果事件已经停止冒泡 则不触发
    if (event.isCatch) {
      return;
    }

    var _ref2 = event || {},
        _ref2$type = _ref2.type,
        type = _ref2$type === void 0 ? "" : _ref2$type,
        _ref2$currentTarget = _ref2.currentTarget,
        currentTarget = _ref2$currentTarget === void 0 ? {} : _ref2$currentTarget;

    var _currentTarget$id = currentTarget.id,
        id = _currentTarget$id === void 0 ? "" : _currentTarget$id;

    if (id && type) {
      var _event, _event$target, _event$target$dataset, _event2, _event2$currentTarget, _event2$currentTarget2;

      var key = id + "_" + type; // console.log("event handle key", key);

      var eventHandlerFuncObj = uidEventHandlerFuncMap[key] || {};
      var isCatch = eventHandlerFuncObj.isCatch;

      if (isCatch) {
        event.isCatch = true;
      }

      var value = eventHandlerFuncObj.value || "";

      if (typeof value === "function") {
        // 需要一个data 用于处理表达式
        value(this.data), _readOnlyError("value");
      } // 处理event的dataSet 将原本的 data-type 转换为 dataset: {type: ""}


      var realDataSet = (_event = event) === null || _event === void 0 ? void 0 : (_event$target = _event.target) === null || _event$target === void 0 ? void 0 : (_event$target$dataset = _event$target.dataset) === null || _event$target$dataset === void 0 ? void 0 : _event$target$dataset.data;
      var currentTargetDataset = (_event2 = event) === null || _event2 === void 0 ? void 0 : (_event2$currentTarget = _event2.currentTarget) === null || _event2$currentTarget === void 0 ? void 0 : (_event2$currentTarget2 = _event2$currentTarget.dataset) === null || _event2$currentTarget2 === void 0 ? void 0 : _event2$currentTarget2.data; // console.log("event", event)

      if (realDataSet || currentTargetDataset) {
        var target = event.target || {};

        var _currentTarget = event.currentTarget || {};

        event = _objectSpread(_objectSpread({}, event), {}, {
          currentTarget: _objectSpread(_objectSpread({}, _currentTarget), {}, {
            dataset: _objectSpread({}, currentTargetDataset)
          }),
          target: _objectSpread(_objectSpread({}, target), {}, {
            dataset: _objectSpread({}, realDataSet || {})
          })
        }); // console.log("dataset", realDataSet, event)
      }

      if (typeof value === "function") {
        // 对象设置原本就是个function 则直接触发
        value(event);
      } else if (typeof this[value] === "function") {
        // 返回的是字符串 在对象上能找到对应的方法
        this[value](event);
      } else {// 没有对应的事件触发
        // console.log("event 没找到对应的事件", key)
      }
    }
  }
  /**
   * 根据 data 构造渲染结果
   * @param data
   */


  function renderFunction() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isFirstRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // 渲染的时候将渲染数据加到数据源的原型上
    // 遍历节点 将属性值为函数的都执行一遍 获得渲染结果
    // console.log("renderFunction data", data)
    var newVdoms = isFirstRender ? vdomsTemplate.firstRender(data) : vdomsTemplate.updateRender(data, 0, true).getValue(); // console.log("newVdoms", JSON.stringify(newVdoms, null, 2));

    return newVdoms;
  } // ------- 下面是找出数据变化后，最少的数据改动对象 ----- 
  // ---------------------- 下面是主要代码 ---------------------

  /**
   * 找到渲染树的最小化变更
   */


  var isProd = false;
  var childrenKey = isProd ? "_a" : "children";
  var contentKey = isProd ? "_b" : "content";
  var tagNameKey = isProd ? "_c" : "tagName";
  var attributesKey = isProd ? "_d" : "attributes";
  var vdomsKey = isProd ? "_e" : "vdoms";
  /**
   * 属性依赖类
   */

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      var dataKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

      _classCallCheck(this, Dep);

      this.dataKey = dataKey;
      this.keyNodeList = [];
      this._keyList = [];
    }

    _createClass(Dep, [{
      key: "addTempKey",
      value: function addTempKey(keyList) {
        var _this = this;

        if (!keyList || !Array.isArray(keyList)) {
          console.error("addTempKey 不是数组");
          return;
        } // 保存依赖关系 哪个节点 哪个key 还有可能是层级嵌套
        // const oneFloorKeyNodeList = []


        keyList.map(function (key, index) {
          var node = currentTreeNodes[index];
          var onlyKey = "" + node.id + "__" + key;

          if (_this._keyList.indexOf(onlyKey) >= 0) {
            return;
          }

          _this._keyList.push(onlyKey);

          _this.keyNodeList.push({
            key: key,
            node: node,
            floor: index
          });
        });
      }
    }, {
      key: "notify",
      value: function notify() {
        var startFloor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        // console.log("this._keyList", this.dataKey, this._keyList);
        // 告诉节点要更新节点的这些属性
        // 遍历属性节点列表，告诉节点对应的属性需要更新
        this.keyNodeList.map(function (item) {
          var _ref3 = item || {},
              key = _ref3.key,
              node = _ref3.node,
              floor = _ref3.floor; // 如果是低层级的 少于高层级的节点 则不通知更新


          if (floor < startFloor) {
            return;
          }

          if (!node || !key) {
            console.error("遍历属性节点列表，出错 没有属性或节点值");
            return;
          }

          if (!node.nextUpdateKeyList) {
            node.nextUpdateKeyList = [];
          }

          var index = node.nextUpdateKeyList.indexOf(key);

          if (index >= 0) {
            // 已经将属性加到更新列表
            return;
          }

          node.nextUpdateKeyList.push(key);
        });
      }
    }]);

    return Dep;
  }(); // 当前节点树列表


  var currentTreeNodes = [];
  /**
   * 增加节点到当前节点列表
   * @param {*} node 
   */

  function addCurrentTreeNodes(node) {
    // console.log("addCurrentTreeNodes", node);
    if (node && currentTreeNodes.indexOf(node) === -1) {
      currentTreeNodes.push(node);
    }
  }
  /**
   * 从节点列表移除节点
   * @param {*} node 
   * @returns 
   */


  function removeCurrentTreeNodes(node) {
    if (!node) {
      return;
    }

    var index = currentTreeNodes.indexOf(node);

    if (index >= 0) {
      currentTreeNodes.splice(index, 1);
    }
  }
  /**
   * 输出当前节点列表
   */


  function logCurrentTreeNodes() {// console.log("currentTreeNodes", currentTreeNodes)
  }

  function NullNode() {}

  NullNode.prototype.__null__ = true;
  var nullNode = new NullNode();
  /**
   * 绑定初次渲染函数以及更新函数
   * @param {*} template 
   * @returns 
   */

  function addFirstAndUpdateRender(template) {
    if (_typeof(template) !== "object") {
      //  console.log("addFirstAndUpdateRender传入数据有问题")
      return;
    }

    template.firstRender = firstRender.bind(template);
    template.updateRender = updateRender.bind(template);
  }

  function bindRealData(_realData) {
    realData = _realData;
  }
  /**
   * 首次根据渲染数据构造渲染数据
   * @param {*} data 
   * @returns 渲染树
   */


  function firstRender(data) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!this.nodeList) {
      this.nodeList = [];
    }

    if (!this.nodeList[index]) {
      this.nodeList[index] = {
        id: this.id + "_" + index
      };
    }

    var treeNode = this.nodeList[index]; // 把节点树加到节点树列表

    addCurrentTreeNodes(treeNode);
    var updateTemplate = {};
    var domTree = [];

    if (Array.isArray(this.firstTemplate)) {
      // 如果是数组 则用数组的遍历方式
      domTree = walkTemplateList(this.firstTemplate, data, updateTemplate, this.prekey);
    } else {
      // 如果是单个节点 则用遍历单个节点的方式 
      domTree = walkTemplate(this.firstTemplate, data, undefined, updateTemplate, this.prekey, index);
    } // console.log("updateTemplate", updateTemplate);
    // 暂存更新模板


    treeNode.updateTemplate = updateTemplate; // 将节点从当前遍历节点列表中移除

    removeCurrentTreeNodes(treeNode); // 初始化下一次渲染key 为空数组

    treeNode.nextUpdateKeyList = [];
    return domTree;
  }
  /**
   * 更新对象
   * @param {*} isRoot 
   */


  function UpdateObject() {
    var isRoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    this.isRoot = isRoot;
    this.resultArray = [];
    this.resultObj = {};
  }
  /**
   * 获取结果
   * @returns 
   */


  UpdateObject.prototype.getValue = function () {
    if (this.isRoot) {
      return this.resultObj;
    }

    return this.resultArray;
  };
  /**
   * 获取数组的值
   * @returns 
   */


  UpdateObject.prototype.getArrayValue = function () {
    return this.resultArray;
  };
  /**
   * 获取对象的值
   * @returns 
   */


  UpdateObject.prototype.getObjValue = function () {
    return this.resultObj;
  };
  /**
   * 增加变化的属性和对应的值
   * @param {*} key 
   * @param {*} value 
   */


  UpdateObject.prototype.add = function (key, value) {
    this.resultObj[key] = value;
    this.resultArray.push({
      key: key,
      value: value
    });
  };
  /**
   * 更新对象的变化值
   */


  UpdateObject.prototype.__update__ = true;
  /**
    * 再次渲染
    * @param {*} data 渲染数据
    * @returns 变化的对象
    */

  function updateRender(data) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var isRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isCheckAllChage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    // 获取当前的节点
    var treeNode = this.nodeList[id]; // 把节点树加到节点树列表

    addCurrentTreeNodes(treeNode); // 拿到更新的updateTemplate

    var updateTemplate = treeNode.updateTemplate;
    var updateResult = new UpdateObject(isRoot); // console.log("treeNode.nextUpdateKeyList", treeNode.nextUpdateKeyList);

    if (isCheckAllChage) {
      if (!treeNode.allKeys) {
        treeNode.allKeys = Object.keys(updateTemplate);
      }

      treeNode.keys = treeNode.allKeys;
    } else {
      treeNode.keys = treeNode.nextUpdateKeyList || [];
    }

    treeNode.nextUpdateKeyList = []; // console.log("nextUpdateKeyList", id, treeNode.keys);

    treeNode.keys.map(function (key) {
      var changeNode = updateTemplate[key]; //  console.log("changeNode", changeNode);

      var _ref4 = changeNode || {},
          pre = _ref4.pre,
          render = _ref4.render; // console.log("updateRender key", key);


      if (typeof render !== "function") {
        //  console.log("重新渲染数据不是变化的")
        return;
      }

      tempKeyList.push(key); // 重新渲染的数据

      var nextRenderValue = render(data);
      tempKeyList.pop(); //  console.log("nextRenderValue", nextRenderValue);
      // 判断是不是wxif的节点

      if (changeNode.isWxIf) {
        // 如果是首次放开 则直接修改整个对象
        if (pre.__null__ && !nextRenderValue.__null__) {
          // updateResult[key] = nextRenderValue
          updateResult.add(key, nextRenderValue);
          changeNode.pre = nextRenderValue;
        } // 如果是更新
        else if (!pre.__null__ && nextRenderValue.__update__) {
          // 子节点也是更新 那就拼接字符串
          nextRenderValue.getArrayValue().map(function (item) {
            var childKey = item.key; // 拼接当前key 和 子节点key
            // updateResult[keyJoin(key, childKey)] = nextRenderValue[childKey]

            updateResult.add(keyJoin(key, childKey), item.value);
          });
        } // 如果原本是显示，后面隐藏
        else if (!pre.__null__ && nextRenderValue.__null__) {
          // updateResult[key] = nextRenderValue
          updateResult.add(key, nextRenderValue);
          changeNode.pre = nextRenderValue;
        } // 如果原本是隐藏 后面还是隐藏 不处理
        // 判断是不是wxFor节点

      } else if (changeNode.isWxFor) {
        // //  console.log("isWxFor changeNode nextRenderValue", nextRenderValue);
        if (!nextRenderValue.__update__) {
          // 不是更新节点的情况 
          console.error("wxfor 再次渲染函数得到的结果不是 更新节点");
          return;
        }

        nextRenderValue.getArrayValue().map(function (item) {
          var childKey = item.key;
          var realChildKey = keyJoin(key, childKey, true); // 判断是直接更新对象还是更新对象属性

          var nextChildRenderValue = item.value;

          if (nextChildRenderValue.__update__) {
            // 如果也是更新属性
            nextChildRenderValue.getArrayValue().map(function (grandsonItem) {
              var grandsonKey = grandsonItem.key; // 拼接前面的key和孙key 

              var realGrandsonKey = keyJoin(realChildKey, grandsonKey); // updateResult[realGrandsonKey] = nextChildRenderValue[grandsonKey]

              updateResult.add(realGrandsonKey, grandsonItem.value);
            });
          } else {
            // updateResult[realChildKey] = nextChildRenderValue
            updateResult.add(realChildKey, nextChildRenderValue);
          }
        });
      } else {
        // 判断和原本结果是否一致，如果不一致则更新
        // TODO: 判断对象的变化
        var isChange = judgeHasChage(pre, nextRenderValue); // console.log("isChange", key, isChange, pre, nextRenderValue, data, real);

        if (isChange) {
          // updateResult[key] = nextRenderValue
          updateResult.add(key, nextRenderValue);
          changeNode.pre = nextRenderValue;
        }
      }
    });
    removeCurrentTreeNodes(treeNode);
    return updateResult;
  }
  /**
   * 判断对象是否有改变
   * @param {*} pre 
   * @param {*} next 
   * @returns 
   */


  function judgeHasChage(pre, next) {
    // 判断类型
    if (pre !== next) {
      return true;
    }
  }
  /**
   * 遍历模板列表
   * @param {*} templateList 模板列表
   * @param {*} data 渲染数据
   * @param {*} updateTemplate 更新模板
   * @param {*} prekey 前一个节点的key
   * @returns 
   */


  function walkTemplateList(templateList, data) {
    var updateTemplate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var prekey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var result = [];

    if (!templateList) {
      return result;
    } //  console.log("templateList", templateList);
    // 参数判断


    if (!Array.isArray(templateList)) {
      //  console.log("templateList不是列表")
      return result;
    }

    var wxForListLen = 0;
    var preTemplate; // 开始遍历

    for (var i = 0; i < templateList.length; i++) {
      var template = templateList[i];

      if (template.wxFor) {
        // 如果是wxfor 把wxfor 节点 和后面的节点组装到一块
        var vdoms = walkTemplate(template, data, preTemplate, updateTemplate, prekey, i);
        result = result.concat(vdoms);
        wxForListLen += vdoms.length - 1;
      } else {
        var tempKey = keyJoin(prekey, i + wxForListLen, true);
        var vdom = walkTemplate(template, data, preTemplate, updateTemplate, tempKey);
        result.push(vdom);
      }

      preTemplate = template;
    } //  console.log("result.length", result.length);


    return result;
  }
  /**
   * 组合前后节点key
   * @param {*} pre 
   * @param {*} next 
   * @param {*} isArray 
   * @returns 
   */


  function keyJoin(pre, next) {
    var isArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (isArray) {
      if (!pre) {
        console.log("key 拼接出错 数组没有前面的key");
      }

      return pre ? pre + "[" + next + "]" : next;
    } else {
      return pre ? pre + "." + next : next;
    }
  }
  /**
   * 遍历单个节点
   * @param {*} template 单个节点的渲染模板
   * @param {*} data 数据
   * @param {*} preTemplate 前一个节点的渲染模板
   * @param {*} updateTemplate 更新模板
   * @param {*} prekey 前一个属性的key
   */


  function walkTemplate(template, data, preTemplate) {
    var updateTemplate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var prekey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var startIndex = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    //  console.log("template", template);
    // 判断是不是 wxIf 节点
    if (template.wxIf || template.wxElif || template.wxElse) {
      var templateNode = handleTemplate2Node(template, preTemplate);
      var renderFunc = getWxIfRenderFuncTemplateById(templateNode);
      tempKeyList.push(prekey);
      var result = renderFunc(data);
      updateTemplate[prekey] = {
        isWxIf: true,
        pre: result,
        render: renderFunc
      };
      tempKeyList.pop();
      return result;
    } // 判断是不是 wxFor 节点


    if (typeof template.wxFor !== "undefined") {
      // 构建一个wxFor的节点
      var _templateNode = handleTemplate2Node(template);

      var _renderFunc = getWxForRenderFuncTemplateById(_templateNode, startIndex);

      tempKeyList.push(prekey);

      var _result = _renderFunc(data, true);

      updateTemplate[prekey] = {
        isWxFor: true,
        pre: _result,
        render: _renderFunc
      };
      tempKeyList.pop();
      return _result;
    } // 下面是静态节点的处理


    var vdom = _defineProperty({}, tagNameKey, template[tagNameKey] || template._tag || template.tag || template.tagName);

    if (template[contentKey]) {
      /**
       * {
       *   tag: "text",
       *   content: function(){}
       * }
       */
      var key = contentKey;
      var value = template[contentKey];

      if (typeof value === "function") {
        var realKey = keyJoin(prekey, key);
        tempKeyList.push(realKey);

        var _result2 = value(data);

        updateTemplate[realKey] = {
          pre: _result2,
          render: value
        };
        value = _result2;
        tempKeyList.pop();
      }

      vdom[key] = value;
      return vdom;
    }

    vdom.uid = template.uid, vdom.key = template.uid + "_" + startIndex; // 遍历属性

    var attributes = template[attributesKey] || [];

    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];
      var _key = attribute.key;
      var _value = attribute.value; // 如果值是一个方法 需要计算得出 则是属于可变化内容

      if (typeof _value === "function") {
        // 加入变化范围
        var _realKey = keyJoin(prekey, _key);

        tempKeyList.push(_realKey);

        var _result3 = _value(data);

        updateTemplate[_realKey] = {
          pre: _result3,
          render: _value
        };
        _value = _result3;
        tempKeyList.pop();
      }

      vdom[_key] = _value;
    } // 遍历dataSet


    var dataSet = template.dataSet;

    if (_typeof(dataSet) === "object") {
      vdom.dataSet = {};
      var dataSetPreKey = keyJoin(prekey, "dataSet");
      Object.keys(dataSet).map(function (key) {
        var value = dataSet[key]; // console.log("dataSet add update", key, value);
        // 如果值是一个方法 需要计算得出 则是属于可变化内容

        if (typeof value === "function") {
          // 加入变化范围
          var _realKey2 = keyJoin(dataSetPreKey, key); // console.log("dataSetPreKey realKey", realKey);


          tempKeyList.push(_realKey2);

          var _result4 = value(data);

          updateTemplate[_realKey2] = {
            pre: _result4,
            render: value
          };
          value = _result4;
          tempKeyList.pop();
        }

        vdom.dataSet[key] = value;
      });
    } // 遍历children


    var children = template[childrenKey];
    /**
     * {
     *  tag: "view"
     *  children: [
     *      {}
     *  ]
     * }
     */

    prekey = keyJoin(prekey, childrenKey);
    vdom[childrenKey] = walkTemplateList(children, data, updateTemplate, prekey);
    return vdom;
  }
  /**
   * 将原生template组装成一个渲染节点，抽离渲染出模板，和wxif wxfor 的控制逻辑
   * @param {*} template 
   * @param {*} preTemplate 
   * @returns 
   */


  function handleTemplate2Node(template, preTemplate) {
    var wxIf = template.wxIf,
        wxElif = template.wxElif,
        wxElse = template.wxElse,
        wxFor = template.wxFor,
        wxForIndex = template.wxForIndex,
        wxForItem = template.wxForItem,
        wxForVarNameList = template.wxForVarNameList,
        firstTemplate = _objectWithoutProperties(template, _excluded);

    var currentWxIf = wxIf;

    if (!wxIf && (wxElif || wxElse)) {
      currentWxIf = function currentWxIf() {
        if (wxIf) {
          return wxIf.apply(void 0, arguments);
        } else if (wxElif) {
          return !preTemplate.wxIf.apply(preTemplate, arguments) && wxElif.apply(void 0, arguments);
        } else {
          return !preTemplate.wxIf.apply(preTemplate, arguments);
        }
      };

      template.wxIf = currentWxIf;
    }

    return {
      id: templateId++,
      wxIf: currentWxIf,
      wxElif: wxElif,
      wxElse: wxElse,
      wxFor: wxFor,
      wxForIndex: wxForIndex,
      wxForItem: wxForItem,
      firstRender: firstRender,
      firstTemplate: firstTemplate,
      wxForVarNameList: wxForVarNameList,
      updateRender: updateRender
    };
  }
  /**
   * 根据wxIfId 找到对应的模板 并返回一个构建函数，执行之后会返回一颗节点数或
   * @param {*} wxIfId 
   * @returns 渲染dom树 或者节点数
   */


  function getWxIfRenderFuncTemplateById(template) {
    return function (data) {
      // 判断是否需要展示
      var wxIf = false;

      if (typeof template.wxIf !== "undefined") {
        // console.log("getWxIfRenderFuncTemplateById wxIf", template);
        wxIf = typeof template.wxIf === "function" ? template.wxIf(data) : !!template.wxIf;
      } // //  console.log("wxIf", wxIf);


      var result = new NullNode(); // 如果之前是隐藏 现在是展示

      if (!template.preWxIf && wxIf) {
        // 执行首次渲染的逻辑
        // console.log("执行首次渲染的逻辑");
        result = template.firstRender(data); // 之前是展示，现在也是展示
      } else if (template.preWxIf && wxIf) {
        // console.log("template.preWxIf && wxIf updateRender", template);
        result = template.updateRender(data); // result.__update__ = true
        // 之前是展示 现在是隐藏
      } else if (template.preWxIf && !wxIf) {// result = {}
        // 之前是隐藏 现在还是隐藏
      } else {// result = {}
      } // 将这次的状态设置为上一次的状态


      template.preWxIf = wxIf;
      return result;
    };
  }
  /**
   * 增加渲染数据的监听
   * @param {*} data 需要监听的数据对象
   * @param {*} keys key列表
   * @param {*} wxForVarNameList key属性如果是对象的话，对应的属性列表 [{key: "item", secondKeyList: ["value"]}]
   */


  function addObserver(data, keys, wxForVarNameList) {
    if (!Array.isArray(keys)) {
      console.error("addObserver keys not array");
      return;
    }

    var targetData = {}; // 只通知 后面层级的更新 不通知前面层级更新

    var startFloor = currentTreeNodes.length; // 如果在编译层收集了item 对应的属性

    if (Array.isArray(wxForVarNameList) && wxForVarNameList.length > 0) {
      wxForVarNameList.map(function (item) {
        var key = item.key,
            secondKeyList = item.secondKeyList;

        if (!key) {
          console.warn("observer key is undefined");
          return;
        } // 构建首层的监听 item.value 或 item ==> 构建item的监听


        var dep = new Dep();
        var hasSecondKeyList = Array.isArray(secondKeyList) && secondKeyList.length > 0;
        var childData = data[key]; // data["item"] = { title: "", tip = {}}

        var childProxyData = {};
        Object.defineProperty(targetData, key, {
          get: function get() {
            // 保存映射关系
            dep.addTempKey(tempKeyList); // 获取结果

            return childData;
          },
          set: function set(newValue) {
            // 如果值没发生变化 并且是没有子属性
            if (!hasSecondKeyList && newValue === childData) {
              return;
            } // 先通知子节点的属性变化，子节点的属性通过childData[key] 取值，如果先设置了 childData = newValue 则无法知道哪个有更新


            if (_typeof(newValue) === "object" && hasSecondKeyList) {
              secondKeyList.map(function (secondKey) {
                // console.log("childProxyData", secondKey, childProxyData[secondKey], newValue[secondKey]);
                childProxyData[secondKey] = newValue[secondKey];
              });
            } // 保存结果


            childData = newValue; // 通知对应的属性更新

            dep.notify(startFloor);
          }
        }); // 如果没有第二层属性 则不需要监听第二层属性

        if (hasSecondKeyList) {
          // 监听修改过的变量名
          Object.defineProperty(targetData, "_" + key, {
            get: function get() {
              // 获取结果
              return childProxyData;
            }
          }); // ["value", "id", "tip"]

          secondKeyList.map(function (secondKey) {
            var childDep = new Dep();
            Object.defineProperty(childProxyData, secondKey, {
              get: function get() {
                // 保存映射关系
                childDep.addTempKey(tempKeyList); // 如果不是元数据对象的话 就返回undefined

                if (_typeof(childData) !== "object") {
                  return undefined;
                } // 获取结果


                return childData[secondKey];
              },
              set: function set(newValue) {
                // 如果不是元数据对象的话 就直接返回 不存在这样的情况
                if (_typeof(childData) !== "object") {
                  return;
                } // 如果值没发生变化


                if (newValue === childData[secondKey]) {
                  return;
                } // console.log("第二层数据有更新", key, secondKey);
                // 不需要保存结果 因为这个结果都是从childData取出来的 这个set 只是为了通知更新
                // childData[secondKey] = newValue
                // 通知对应的属性更新


                childDep.notify(startFloor);
              }
            });
          });
        }
      });
    } else {
      // 如果没有wxForVarNameList
      keys.map(function (key) {
        var dep = new Dep();
        Object.defineProperty(targetData, key, {
          get: function get() {
            // 保存映射关系
            dep.addTempKey(tempKeyList); // 获取结果

            return data[key];
          },
          set: function set(newValue) {
            // 如果值没发生变化
            if (newValue === data[key]) {
              return;
            } // 保存结果


            data[key] = newValue; // 通知对应的属性更新

            dep.notify(startFloor);
          }
        });
      });
    }

    return targetData;
  }
  /**
   * 分割字符
   * @param {*} key 
   */


  function splitKey(key) {
    var result = [];
    var oneKey = "";

    for (var i = 0; i < key.length; i++) {
      var currentChar = key[i];

      if (currentChar === "." || currentChar === "[" || currentChar === "]") {
        if (oneKey) {
          // 存在key 才加入 如果是[1]. 的情况就会onekey为空
          result.push(oneKey);
        }

        oneKey = "";
      } else {
        oneKey += currentChar;
      }
    }

    if (oneKey) {
      result.push(oneKey);
    }

    return result;
  }
  /**
   * 结合更新的属性到第一次渲染的数据上
   * @param {*} firstVdom 
   * @param {*} updateVdom 
   */


  function combineFirstVdomAndUpdateVdom(firstVdom, updateVdom) {
    // console.log("firstVdom", JSON.stringify(firstVdom, null, 2));
    // console.log("updateVdom", JSON.stringify(updateVdom, null, 2));
    updateVdom.getArrayValue().map(function (_ref5) {
      var key = _ref5.key,
          value = _ref5.value;
      // console.log("key, value", key, value);
      // key = "a.b[1].d"
      // value = 1 || "xss" || {}
      // 分割key 拿到key 的列表
      var keys = splitKey(key) || [];
      console.log("firstVdom", firstVdom); // 拿到最后一个设置的key 比如说 a.b[1].d" 的 d

      var endKey = keys.splice(-1, 1)[0] || ""; // 取到最后一个设置的对象 a.b[1]

      var data = keys.reduce(function (data, key) {
        console.log("key", key, data);
        return data[key];
      }, firstVdom); // 设置对象的属性 为变化的值
      // a.b[1]['d'] = value

      if (data || endKey) {
        data[endKey] = value;
      }
    }); // console.log("firstVdom", JSON.stringify(firstVdom, null, 2));

    return firstVdom;
  }
  /**
   * 获取wxfor 的渲染函数
   * @param {*} wxForId 
   * @returns 
   */


  function getWxForRenderFuncTemplateById(template) {
    var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // wxFor逻辑
    var itemName = template.wxForItem || "item";
    var indexName = template.wxForIndex || "index";
    var wxForVarNameList = template.wxForVarNameList; // console.log("template", template);
    // console.log("itemName indexName", itemName, indexName)

    var preList = [];
    return function wxForRenderFunc(data) {
      var isFirstRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // 首次渲染
      // 找到wxForList
      var nextList = [];
      var list = typeof template.wxFor === "function" ? template.wxFor(data) : template.wxFor;

      if (!list) {
        // 如果是第一次渲染 则返回空列表
        if (isFirstRender) {
          for (var i = 0; i < 20; i++) {
            if (!nextList[i]) {
              nextList[i] = new NullNode();
            }
          }

          preList = nextList;
          return nextList;
        } // 如果不是 则将原本节点都置为空节点


        list = [];
      } // 遍历list


      var updateResult = new UpdateObject(); // 之前存在的节点就更新

      for (var _i = 0; _i < list.length; _i++) {
        var item = list[_i]; // 判断之前有没有这个节点

        var pre = preList[_i];
        var vdom = void 0;
        var proxyRenderData = void 0; // 之前没有这个节点，或者是空节点 执行初次渲染的逻辑

        if (!pre || pre.__null__) {
          // 构建新的渲染数据 加入item 和index
          // 将原本数据放到原型上，取不到原型的值才会去原本渲染数据取
          var renderData = {};
          renderData[itemName] = item;
          renderData[indexName] = _i; // 增加监听 传入需要监听的数据对象 监听属性 影响的template，第几个

          proxyRenderData = addObserver(renderData, [itemName, indexName], wxForVarNameList); // 给代理对象增加原型

          Object.setPrototypeOf(proxyRenderData, data); //  console.log("renderData", renderData);

          vdom = template.firstRender(proxyRenderData, _i); // 构建下一次的列表数据

          nextList[_i] = {
            firstVdom: vdom,
            data: proxyRenderData,
            isShow: true
          };
        } else {
          pre.data[itemName] = item; // 是否需要检查全部变化，如果是从隐藏到显示 就需要检查全部会变化的属性

          var isNeeCheckAllChange = !pre.isShow; // 上一次是隐藏的
          // 原本就有值

          vdom = template.updateRender(pre.data, _i, false, isNeeCheckAllChange); // 如果之前是隐藏的 则需要组合更新的节点和原有的节点为同一颗树

          if (isNeeCheckAllChange) {
            // 组合原有的属性 和需要更新的值 保留原本的节点树
            vdom = combineFirstVdomAndUpdateVdom(pre.firstVdom, vdom);
          } // 构建下一次的列表数据


          nextList[_i] = {
            firstVdom: pre.firstVdom,
            data: pre.data,
            isShow: true
          };
        }

        var realKey = startIndex + _i; // result[realKey] = vdom
        // 将需要更新的key，以及对应的值 加到更新列表

        updateResult.add(realKey, vdom);
      } // 新节点列表没有 旧节点列表还存在的节点 需要删除


      for (var _i2 = list.length; _i2 < preList.length; _i2++) {
        var _pre = preList[_i2]; // 如果前面就是被删掉的节点 那就不出来

        if (_pre.isShow) {
          // 不是空节点 就是需要删除的节点
          // 计算真正的key
          var _realKey3 = startIndex + _i2;

          _pre.isShow = false;
          updateResult.add(_realKey3, new NullNode());
        }

        nextList[_i2] = _pre;
      } // 输出结果看看
      //  console.log("wxForRenderFunc", result);
      // 保存当前的list 替换上一个list 便于下一次更新


      preList = nextList;

      if (isFirstRender) {
        for (var _i3 = 0; _i3 < 20; _i3++) {
          if (!nextList[_i3]) {
            nextList[_i3] = new NullNode();
          }
        }

        return nextList.map(function (item) {
          return item.firstVdom || item;
        });
      }

      return updateResult;
    };
  }

  var templateId = 0;
  var vdomsTemplate = {
    wxIf: true,
    id: templateId++,
    prekey: vdomsKey,
    firstTemplate: templateVDomCreateList
  }; // 给渲染节点加上 首次渲染方法和再次渲染方法

  addFirstAndUpdateRender(vdomsTemplate); // 临时key堆栈

  var tempKeyList = []; // // 外部代理数据对象
  // const renderProxyData = {}
  // // 真实数据对象
  // let realData = {}
  // 需要给data 加上监听函数的属性key
  // console.log("dataKeys", dataKeys)

  dataKeys.map(function (key) {
    var dep = new Dep(key);
    Object.defineProperty(renderProxyData, key, {
      get: function get() {
        // logCurrentTreeNodes()
        // 保存映射关系
        dep.addTempKey(tempKeyList);
        var value = realData[key]; // console.log("get key value", key, value);

        return value;
      },
      set: function set(value) {
        if (realData[key] === value) {
          return;
        } // console.log("set key value", key, value);


        realData[key] = value; // 通知对应的属性更新

        dep.notify();
      }
    });
  }); // wxs的值单独监听 只需要返回结果就可以

  pageWxsObjKeys.map(function (key) {
    Object.defineProperty(renderProxyData, key, {
      get: function get() {
        return pageWxsObj[key];
      },
      set: function set(value) {}
    });
  });
  /** 页面运行时函数 */

  var BASE_KEY = ['data', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage'];
  var CAN_RUN_BASE_KEY = ["onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", "onShareAppMessage"];
  var PAGE_FUNC = []; // const page = {
  //   onShow: function(){}
  // } // 页面实例

  function Page(pageObj) {
    // console.log("pageObj", pageObj);
    // 收集去除基本属性的属性key列表
    var keys = Object.keys(pageObj).filter(function (key) {
      return BASE_KEY.indexOf(key) === -1;
    }); // 将页面实例的方法挂载到内部对象实例

    ['animate'].map(function (propKey) {
      // 是函数 并且内部对象没有的属性 不是生命周期
      Object.defineProperty(pageObj, propKey, {
        get: function get() {
          return function () {
            if (typeof page[propKey] === "function") {
              page[propKey].apply(page, arguments);
            } else {
              console.log("\u5916\u90E8\u9875\u9762\u7684\u5C5E\u6027".concat(propKey, "\u4E0D\u662F\u51FD\u6570"), page);
            }
          };
        }
      });
    });
    Object.defineProperty(page, "eventHandler", {
      get: function get() {
        return function (event) {
          eventHandler.call(pageObj, event);
        };
      }
    }); // console.log("keys", keys);
    // 将这些属性对应的函数绑定给真正的页面实例 以便触发

    keys.map(function (key) {
      var value = pageObj[key]; // console.log("key isfunction", key, typeof value === "function");

      if (typeof value === "function") {
        // 绑定页面方法给到this
        pageObj[key] = value.bind(pageObj);
      }
    }); // 处理会运行的生命周期 onshow onhide 这些运行时会运行的

    CAN_RUN_BASE_KEY.map(function (key) {
      // 暂存旧的生命周期
      var oldFunc = page[key]; // 重写生命周期

      page[key] = function () {
        // 运行旧的生命周期
        if (typeof oldFunc === "function") {
          oldFunc.call(page);
        } // 运行新的生命周期


        if (typeof pageObj[key] === "function") {
          pageObj[key]();
        }
      };
    });
    var preData = undefined;
    var preRenderTime = 0;
    var throttleTime = 0;
    var timer;
    var callbackList = []; // 执行callback 列表

    function runCallBackList() {
      for (var i = 0; i < callbackList.length; i++) {
        var callback = callbackList[i];

        if (callback && typeof callback === "function") {
          callback.call(pageObj);
        }
      }
    }

    if (!pageObj.data) {
      pageObj.data = {};
    }

    bindRealData(pageObj.data); // 给页面增加页面渲染函数

    pageObj.__render = function (callback) {
      var now = +new Date(); // console.log("preRender relative", now - preRenderTime);

      preRenderTime = now; // 加个节流 

      if (timer) {
        // 存在callback
        if (callback) {
          callbackList.push(callback);
        }

        return;
      }

      callbackList = [callback];
      var that = this;
      timer = true;
      Promise.resolve().then(function (res) {
        console.log("real render", +new Date() - now, throttleTime);

        that._render(runCallBackList);

        timer = undefined;
        callbackList = [];
      });
    };

    pageObj._render = function (callback) {
      var pre = +new Date();
      var isFirstRender = !this._hasRender;
      var vdoms = renderFunction(renderProxyData, isFirstRender) || {};
      var renderDiffTime = +new Date() - pre;
      console.log("renderFuntion", renderDiffTime);

      if (isFirstRender) {
        // 如果是首次渲染的话
        this._hasRender = true;

        var realCallback = function realCallback() {
          firstRenderCallback();

          if (typeof callback === "function") {
            callback.call(pageObj);
          }
        };

        page.setData(_defineProperty({}, vdomsKey, vdoms), realCallback);
      } else {
        // 如果是再次渲染
        page.setData(vdoms, callback);
      }
    }; // 处理内部页面的setData


    pageObj.setData = function () {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      // console.log("inner page setData", obj);
      Object.keys(obj).map(function (key) {
        var nValue = obj[key]; // 不会影响页面渲染的数据 直接挂在到data

        if (dataKeys.indexOf(key) === -1) {
          realData[key] = nValue;
          return;
        } // 如果是对象 并且和元数据相同


        if (nValue && _typeof(nValue) === "object") {
          nValue = JSON.parse(JSON.stringify(nValue));
        } // TODO: 没有处理 'a.b.c': 777 的情况


        renderProxyData[key] = nValue; // if(key.indexOf(".") === -1 && key.indexOf("[") === -1){
        // }
      });

      this.__render(callback);
    }; // 处理不会运行的生命周期函数
    // 页面加载


    if (typeof pageObj.onLoad === "function") {
      // console.log("onLoad", page.options);
      pageObj.onLoad(page.options);
    }
    /** 首次渲染回调 */


    var firstRenderCallback = function firstRenderCallback(cb) {
      console.log("firstRenderCallback");

      if (typeof cb === "function") {
        å;
        cb.call(pageObj);
      } // 页面渲染完成


      if (typeof pageObj.onReady === "function") {
        pageObj.onReady();
      } // 页面渲染完成


      if (typeof pageObj.onShow === "function") {
        pageObj.onShow();
      }

      wx.hideLoading({});
    };

    pageObj.__render();
  }
  /**
   * 判断两个对象是否有变化 没变化会返回false
   * @param {*} oldData 旧数据
   * @param {*} newData 新数据
   * @returns 没有变化 变化后的修改逻辑
   */


  function diff(oldData, newData) {
    // console.log("oldData", oldData, newData);
    // 首先判断数据类型
    if (_typeof(oldData) !== "object" || _typeof(newData) !== "object") {
      // 不是对象 都不处理
      return newData;
    } // console.log("111");
    // 判断是不是数组


    var isArrayOld = Array.isArray(oldData);
    var isArrayNew = Array.isArray(newData);

    if (isArrayOld !== isArrayNew) {
      return newData;
    } // 判断是否有修改


    var hasChange = false; // 修改后的属性

    var modifyData = isArrayOld ? [] : {};

    if (false) {// console.log("isArray", oldData, newData);
      // // 数组的情况 []
      // const oldLen = oldData.length
      // const newLen = newData.length
      // for(let i=0; i<newLen; i++){
      // }
    } else {
      // console.log("isObject", oldData, newData);
      // 对象的情况 {}
      // 对比对象的值是否一致
      var oldKeys = Object.keys(oldData) || [];
      var newKeys = Object.keys(newData) || [];
      newKeys.map(function (key) {
        // 判断在就节点上是否存在值
        var oldIndex = oldKeys.indexOf(key); // 存在 旧值

        var newValue = newData[key];
        var oldValue = oldData[key];

        if (oldIndex < 0) {
          // 不存在
          modifyData[key] = newValue;
          hasChange = true;
        } else {
          oldKeys.splice(oldIndex, 1); // 先判断是什么类型， 如果是基本类型则当场判断

          if (_typeof(newValue) != "object") {
            // 不等才需要处理 相等则不处理
            if (oldValue !== newValue) {
              modifyData[key] = newValue;
              hasChange = true;
            }
          } else {
            // 新属性是对象 则递归遍历
            var childHasChange = diff(oldValue, newValue);

            if (childHasChange) {
              hasChange = true;
              var keys = Object.keys(childHasChange) || [];
              var childIsArray = Array.isArray(oldValue);
              keys.map(function (childKey) {
                modifyData["".concat(connectKeyByIsArray(childIsArray, key, childKey))] = childHasChange[childKey];
              });
            }
          }
        }
      }); // console.log("oldKeys", oldKeys)

      oldKeys.map(function (key) {
        var isObject = _typeof(oldData[key]) === "object";
        modifyData[key] = isObject ? {} : "";
        hasChange = true;
      });
    }

    if (!hasChange) {
      return false;
    }

    return modifyData;
  }
  /**
   * 连接两个字符
   * @param {*} isArray 
   * @param {*} key 
   * @returns 
   */


  function connectKeyByIsArray(isArray, prekey, childKey) {
    if (!isArray) {
      return "".concat(prekey, ".").concat(childKey);
    }

    var isContainDot = childKey.indexOf("."); // 0.xxx
    // console.log("res", isContainDot)

    if (isContainDot > 0) {
      //  => [0].
      childKey = childKey.slice(0, isContainDot) + "]" + childKey.slice(isContainDot);
    } else {
      childKey = childKey + "]";
    }

    return "".concat(prekey, "[").concat(childKey);
  }
  /** 原有页面处理逻辑 */


  Page({
    onShareAppMessage: function onShareAppMessage() {
      return {
        title: 'form',
        path: 'page/component/pages/form/form'
      };
    },
    data: {
      pickerHidden: true,
      chosen: ''
    },
    pickerConfirm: function pickerConfirm(e) {
      this.setData({
        pickerHidden: true
      });
      this.setData({
        chosen: e.detail.value
      });
    },
    pickerCancel: function pickerCancel() {
      this.setData({
        pickerHidden: true
      });
    },
    pickerShow: function pickerShow() {
      this.setData({
        pickerHidden: false
      });
    },
    formSubmit: function formSubmit(e) {
      console.log('form发生了submit事件，携带数据为：', e.detail.value);
    },
    formReset: function formReset(e) {
      console.log('form发生了reset事件，携带数据为：', e.detail.value);
      this.setData({
        chosen: ''
      });
    }
  });
}

module.exports = {
  run: run
};