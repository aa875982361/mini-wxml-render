"use strict";

var app = getApp();

var innerPage = require("./render.js");

Page({
  data: {
    _e: []
  },
  onLoad: function onLoad() {
    this.isLoadPre = true;
    var oldSetData = this.setData;

    this.setData = function (obj, callback) {
      console.log("obj", obj);
      oldSetData.call(this, obj, callback);
    };

    wx.showLoading({
      title: '加载中'
    });
    this.runJsCode();
  },
  onShow: function onShow() {
    console.log("onshow");
  },
  onUnload: function onUnload() {},
  // 运行
  runJsCode: function runJsCode() {
    innerPage.run({
      page: this
    });
  },
  toOriginPage: function toOriginPage() {
    wx.navigateTo({
      url: '/test/index'
    });
  }
});