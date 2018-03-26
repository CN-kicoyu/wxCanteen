const Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayList: [{ name: '早餐', img: 'icon_2' }, { name: '中餐', img: 'icon_3' }, { name: '晚餐', img: 'icon_4' }],
    tomorrowList: [{ name: '早餐', img: 'icon_2' }, { name: '中餐', img: 'icon_3' }, { name: '晚餐', img: 'icon_4' }],
    isChecked1: [false, false, false],
    isDisabled1: [false, false, false],
    isChecked2: [false, false, false],
    remark: ''
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
  onChoose(event) {
    const status = event.currentTarget.dataset.choose
    const index = event.currentTarget.dataset.index
    if (this.data.isDisabled1[index] && status == 1) return
    let modify = 'isChecked' + status + '[' + index + ']'
    this.setData({
      [modify]: !this.data['isChecked' + status][index]
    })
    let newArr, imgName
    if (status == 1) {
      newArr = 'todayList' + '[' + index + '].img'
      imgName = this.data.todayList[index].img.match(/icon\_\d/)[0]
      if (this.data['isChecked' + status][index]) {
        imgName += '_on'
      }
    } else {
      newArr = 'tomorrowList' + '[' + index + '].img'
      imgName = this.data.tomorrowList[index].img.match(/icon\_\d/)[0]
      if (this.data['isChecked' + status][index]) {
        imgName += '_on'
      }
    }
    this.setData({
      [newArr]: imgName
    })
  },
  onChecked () {
    let that = this
    let choose = {
      todayB: this.data.isChecked1[0],
      todayM: this.data.isChecked1[1],
      todayN: this.data.isChecked1[2],
      tomorrowB: this.data.isChecked2[0],
      tomorrowM: this.data.isChecked2[1],
      tomorrowN: this.data.isChecked2[2],
      remark: this.data.remark
    }

    if (!choose.todayB && !choose.todayM && !choose.todayN && !choose.tomorrowB && !choose.tomorrowM && !choose.tomorrowN) {
      wx.showModal({
        title: '提示',
        content: '确定清空所有数据吗？',
        success: function (res) {
          if (res.confirm) {
            that.__createData(choose)
          } else if (res.cancel) {
            return
          }
        }
      })
    } else {
      that.__createData(choose)
    }
  },
  __createData(choose) {
    let that = this
    var user = Bmob.User.current();
    var Point = Bmob.Object.extend("bookPoint");
    var query = new Bmob.Query(Point);

    query.equalTo("userId", user.id);
    query.find({
      success: function (person) {
        if (person.length) {
          query.get(person[0].id, {
            success: function (result) {
              that.__saveData(result, choose)
            },
            error: function (object, error) {

            }
          })
        } else {
          var book = new Point();
          book.set("userId", user.id);
          that.__saveData(book, choose)
        }
      }
    });
  },
  __saveData (book, choose) {
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
        wx.reLaunch({
          url: '/pages/hasBook/hasBook'
        })
      }
    });
  },
  bindKeyInput (event) {
    this.setData({
      remark: event.detail.value
    })
  },
  __getTime() {
    const curDate = new Date()
    const hour = parseInt(curDate.getHours())
    if (hour >= 6) {
      this.setData({
        'isDisabled1[0]': true
      })
      if (hour >= 10) {
        this.setData({
          'isDisabled1[1]': true
        })
        if (hour >= 16) {
          this.setData({
            'isDisabled1[2]': true
          })
        }
      }
    }
  }
})