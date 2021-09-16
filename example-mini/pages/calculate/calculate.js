// pages/calculate/calculate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    op1: 0,
    op2: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  add(){
    const num = this.data.num
    this.setData({
      num: num+1,
    })
  },
  reduce(){
    const num = this.data.num
    this.setData({
      num: num - 1
    })
  },
  op1Input(e){
    const value = e.detail.value
    console.log("value", value);
    const num = parseInt(value)
    if(isNaN(num)){
      wx.showToast({
        title: '操作数不对',
      })
    }
    this.setData({
      op1: num
    })
  },
  op2Input(e){
    const value = e.detail.value
    console.log("value", value);
    const num = parseInt(value)
    if(isNaN(num)){
      wx.showToast({
        title: '操作数不对',
      })
    }
    this.setData({
      op2: num
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})