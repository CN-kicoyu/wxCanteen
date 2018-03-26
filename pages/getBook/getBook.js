const Bmob = require('../../utils/bmob.js');
const util = require('../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayBList: [],
    todayMList: [],
    todayNList: [],
    tomorrowBList: [],
    tomorrowMList: [],
    tomorrowNList: [],
    todayTime: '',
    tomorrowTime: '',
    isFixed: [false,false,false]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const curDate = new Date()
    this.setData({
      todayTime: util.formatTime(new Date()),
      tomorrowTime: util.formatTime(new Date(curDate.getTime() + 24 * 60 * 60 * 1000))
    })

    let that = this
    this.__getFetchData('todayB').then((data) => {
      that.setData({
        todayBList: data
      })
      app.globalData.bookData.todayBList = data
    })
    this.__getFetchData('todayM').then((data) => {
      that.setData({
        todayMList: data
      })
      app.globalData.bookData.todayMList = data
    })
    this.__getFetchData('todayN').then((data) => {
      that.setData({
        todayNList: data
      })
      app.globalData.bookData.todayNList = data
    })
    this.__getFetchData('tomorrowB').then((data) => {
      that.setData({
        tomorrowBList: data
      })
      app.globalData.bookData.tomorrowBList = data
    })
    this.__getFetchData('tomorrowM').then((data) => {
      that.setData({
        tomorrowMList: data
      })
      app.globalData.bookData.tomorrowMList = data
    })
    this.__getFetchData('tomorrowN').then((data) => {
      that.setData({
        tomorrowNList: data
      })
      app.globalData.bookData.tomorrowNList = data
    })
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
    this.__getTime()
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
    let that = this
    this.__getFetchData('todayB').then((data) => {
      that.setData({
        todayBList: data
      })
    })
    this.__getFetchData('todayM').then((data) => {
      that.setData({
        todayMList: data
      })
    })
    this.__getFetchData('todayN').then((data) => {
      that.setData({
        todayNList: data
      })
    })
    this.__getFetchData('tomorrowB').then((data) => {
      that.setData({
        tomorrowBList: data
      })
    })
    this.__getFetchData('tomorrowM').then((data) => {
      that.setData({
        tomorrowMList: data
      })
    })
    this.__getFetchData('tomorrowN').then((data) => {
      that.setData({
        tomorrowNList: data
      })
    })
    this.__getTime()
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
  
  },
  __getFetchData (data) {
    let that = this
    var Point = Bmob.Object.extend("bookPoint");
    var query = new Bmob.Query(Point);
    query.equalTo(data, true);
    return new Promise((resolve, reject) => {
      query.find({
        success: function (person) {
          resolve(person)
        }
      });
    })
  },
  onDetail (event) {
    const list = event.currentTarget.dataset.use
    if (this.data[list].length) {
      wx.navigateTo({
        url: '/pages/detail/detail?list=' + list
      })
    }
  },
  __getTime () {
    const curDate = new Date()
    const hour = parseInt(curDate.getHours())
    if (hour >= 6) {
      this.setData({
        'isFixed[0]': true
      })
      if (hour >= 10) {
        this.setData({
          'isFixed[1]': true
        })
        if (hour >= 16) {
          this.setData({
            'isFixed[2]': true
          })
        }
      }
    }
  }
})