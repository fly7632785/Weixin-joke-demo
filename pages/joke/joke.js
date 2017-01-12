var showapi_appid = "30040"
var showapi_sign = "83d55e2b18c444a2b2da3034bf7e23bd"

var that;

var page =
  {
    data: {
      isRefresh: false,
      isLoadMore: false,
      list: [],
      pageIndex: 1,
      scrollTop: 0,
      scrollHeight: 0
    },
    onLoad: function (options) {
      that = this;
      wx.getSystemInfo({
        success: function (res) {
          console.log(res.windowHeight);
          that.setData({
            scrollHeight: res.windowHeight
          });
        }
      });
      wx.showToast({
        title: "拼命加载中",
        icon: "loading",
        duration: 10000
      });
      // 生命周期函数--监听页面加载
      getJokeData();
    },
    refresh: function (e) {
      // 页面相关事件处理函数--监听用户下拉动作
      console.log("refresh");
      page.data.pageIndex = 1;
      that.setData({
        isRefresh: true,
        pageIndex: 1,
        scrollTop: 0,
        list: []
      })
      getJokeData();
    },
    loadmore: function (e) {
      // 页面上拉触底事件的处理函数
      console.log("loadmore");
      var p = page.data.pageIndex;
      page.data.pageIndex = p + 1;
      that.setData({
        pageIndex: p,
        isLoadMore: true,
      })
      getJokeData();
    },
    scroll: function (event) {
      console.log("scroll");
      this.setData({
        scrollTop: event.detail.scrollTop
      });
    }

  }

/**
 *page之外的函数
 page 的data 就是前面的data
 page就是Page的对象
 */
var getJokeData = function () {
  console.log("page:" + page.data.pageIndex);
  wx.request({
    url: 'http://route.showapi.com/341-2',
    data: {
      // 这里要填填 page对象的data里面的page
      "page": page.data.pageIndex,
      "showapi_appid": showapi_appid,
      "showapi_sign": showapi_sign
    },
    method: 'GET',
    success: function (res) {

      // success
      wx.hideToast();
      console.log(that.data.list);
      console.log(res.data.showapi_res_body.contentlist);
      //这里可以填page.data.list 也可以that.data.list
      //因为that就指向page
      var list = page.data.list;
      for (var i = 0; i < res.data.showapi_res_body.contentlist.length; i++) {
        list.push(res.data.showapi_res_body.contentlist[i]);
      }
      console.log(list);
      //但是这里的that不能换成page 至于page和that的关系
      that.setData({
        list: list,
        isRefresh: false,
        isLoadMore: false
      })

    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

Page(page)