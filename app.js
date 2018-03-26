const Bmob = require('utils/bmob.js');
const util = require('utils/util.js');
Bmob.initialize("", "");

App({
  onLaunch: function () {
    let that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //实例化
    var user = new Bmob.User();
    
    this.__searchData().then((data) => {
      var Point = Bmob.Object.extend("bookPoint");
      if (data.length) {
        data.forEach((item) => {
          var query1 = new Bmob.Query(Point);
          query1.equalTo("userId", item.id);
          query1.find({
            success: function (person) {
              if (!person.length) return
              let isModifys = person[0].updatedAt.match(/\d{4}-\d{2}-\d{2}/)[0].replace(/-/g, '/') != util.formatTime(new Date()).toString();
              if (isModifys) {
                var query2 = new Bmob.Query(Point);
                query2.get(person[0].id, {
                  success: function (result) {
                    let choose = {
                      todayB: result.attributes.tomorrowB,
                      todayM: result.attributes.tomorrowM,
                      todayN: result.attributes.tomorrowN,
                      tomorrowB: false,
                      tomorrowM: false,
                      tomorrowN: false,
                      remark: ''
                    }
                    that.__saveData(result, choose)
                  },
                  error: function (object, error) {
                    console.log(error)
                  }
                })
              }
            }
          });
        })
      }
    })

    // 登录
    wx.login({
      success: function (res) {
        user.loginWithWeapp(res.code).then(function (user) {
          var openid = user.get("authData").weapp.openid;
          if (user.get("nickName")) {
            if (user.get('status') == 1) {
              wx.reLaunch({
                url: '/pages/needBook/needBook'
              })
            } else if (user.get('status') == 2) {
              wx.redirectTo({
                url: '/pages/getBook/getBook'
              })
            }

            wx.setStorageSync('openid', openid)
          } else {
            //保存用户其他信息，比如昵称头像之类的
            wx.getUserInfo({
              success: function (result) {

                var userInfo = result.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;

                that.globalData.userInfo = userInfo
                var u = Bmob.Object.extend("_User");
                var query = new Bmob.Query(u);
                query.get(user.id, {
                  success: function (result) {
                    result.set('nickName', nickName);
                    result.set("userPic", avatarUrl);
                    result.set("openid", openid);
                    result.save(null, {
                      success: function (post) {
                        wx.showToast({
                          title: '注册成功',
                          icon: 'success',
                          duration: 1500
                        })
                      }
                    });
                  }
                });
              }
            });
          }
        }, function (err) {
          console.log(err, 'errr');
        });
      }
    })
  },
  globalData: {
    userInfo: null,
    bookData: {
      todayBList: [],
      todayMList: [],
      todayNList: [],
      tomorrowBList: [],
      tomorrowMList: [],
      tomorrowNList: []
    }
  },
  __saveData(book,choose) {
    Object.keys(choose).forEach((item) => {
      book.set(item, choose[item]);
    })
    book.save();
  },
  __searchData () {
    var Point = Bmob.Object.extend("_User");
    var query = new Bmob.Query(Point);
    query.equalTo('status', 1);
    return new Promise((resolve, reject) => {
      query.find({
        success: function (person) {
          resolve(person)
        }
      });
    })
  }
})