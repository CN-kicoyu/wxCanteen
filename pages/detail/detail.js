const Bmob = require('../../utils/bmob.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = app.globalData.bookData[options.list]
    let list = []
    let that = this
    data.forEach((item) => {
      var u = Bmob.Object.extend("_User");
      var query = new Bmob.Query(u);
      query.get(item.attributes.userId, {
        success: function (result) {
          list.push({ userPic: result.attributes.userPic, nickName: result.attributes.nickName, remark: item.attributes.remark})
          that.setData({
            list: list
          })
        },
        error: function (result, error) {
          console.log("查询失败");
        }
      });
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