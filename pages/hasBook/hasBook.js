const Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayList: [],
    tomorrowList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    var user = Bmob.User.current();
    var Point = Bmob.Object.extend("bookPoint");
    var query = new Bmob.Query(Point);
    query.equalTo("userId", user.id);
    query.find({
      success: function (person) {
        if (person.length) {
          that.__updataList(person[0].attributes)
        } else {
          var book = new Point();
          book.set("userId", user.id);
          that.__saveData(book, choose)
        }
      }
    });
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
  
  },
  __saveData(book, choose) {
    Object.keys(choose).forEach((item) => {
      book.set(item, choose[item]);
    })
    book.save(null, {
      success: function (post) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500
        })
      }
    });
  },
  __updataList (list) {
    let todayList = []
    let tomorrowList = []
    if (list.todayB) todayList.push({ name: '早餐', img: 'icon_2' })
    if (list.todayM) todayList.push({ name: '中餐', img: 'icon_3' })
    if (list.todayN) todayList.push({ name: '晚餐', img: 'icon_4' })
    if (list.tomorrowB) tomorrowList.push({ name: '早餐', img: 'icon_2' })
    if (list.tomorrowM) tomorrowList.push({ name: '中餐', img: 'icon_3' })
    if (list.tomorrowN) tomorrowList.push({ name: '晚餐', img: 'icon_4' })

    this.setData({
      todayList: todayList,
      tomorrowList: tomorrowList
    })
  }
})