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


var getJokeData = function () {
  console.log("page:" + page.data.pageIndex);
  wx.request({
    url: 'http://route.showapi.com/341-1',
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
      var list = that.data.list;
      for (var i = 0; i < res.data.showapi_res_body.contentlist.length; i++) {
        //先从json对象转为stirng 然后过滤
        //然后还要转化为json对象
        var  item = JSON.stringify(res.data.showapi_res_body.contentlist[i]);
        console.log("item"+item);
        //由于接口返回数据有点问题
        //这里高能 采用的过滤调用4种字符串 
        // <p> </p> <p class="MsoNormal">  &nbsp;
        // 注意/要加转义\  "也要用\
        //这里 <p class="MsoNormal"> 有点特别 看log就知道了了
        //它原本是这样的 <p class=\"MsoNormal\"> 所以加上一个转义就变成了<p class=\\"MsoNormal\\">
        var a = item.replace(
          new RegExp(/(<p>)|(<\/p>)|(<p class=\\"MsoNormal\\">)|(&nbsp;)/g),'');
        console.log("a"+a);
        list.push(JSON.parse(a));
      }
      console.log(list);

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