# 微信小程序入门级教程-11

> 前言

&emsp;&emsp;上节课中我们讲了如何通过调用接口获取真实数据，那么这节课我们就要开始制作更多页面了，因为上节课，更多这个功能我们是没有做的，效果如下：

![效果图](https://upload-images.jianshu.io/upload_images/8919399-26a19a86d20b804b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 目录

https://www.jianshu.com/p/9c9b555b52e8

> 步骤

1. 首先我们在`movies`目录下创建更多页面`more-movie`和`movie-grid`文件夹，然后创建四大件：`~.wxml，~.wxss，~.js，~.json`。

结果如下：

![更多页面结构图](https://upload-images.jianshu.io/upload_images/8919399-5af8f3c88b399ac5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 我们用`movie-grid.wxml`来封装电影信息，然后在`more-movie.wxml`页面中，我们只需要引入该模板就行了，如下所示：
`movie-grid.wxml`
```html
<!--pages/movies/movie-grid/movie-grid.wxml-->
<import src="../movie/movie-template.wxml" />
<template name="movieGridTemplate">
    <view class="grid-container">
        <block wx:for="{{movies}}" wx:for-item="movie">
            <view class="single-grid-container">
                <template is="movieTemplate" data="{{...movie}}" />
            </view>
        </block>
    </view>
</template>
```

`movie-grid.wxss`
```css
/* pages/movies/movie-grid/movie-grid.wxss */
@import "../movie/movie-template.wxss";
.grid-container{
    
}
.single-grid-container{
    float: left;
    margin: 20rpx 0 20rpx 6rpx;
}
```

封装好了这个电影内容的组件后，我们在`more-movie`中直接引入即可，如下：

```html
<!--pages/movies/more-movie/more-movie.wxml-->
<import src="../movie-grid/movie-grid.wxml" />
<template is="movieGridTemplate" />
```
接下来就是引入模板的样式了，如下：
```css
/* pages/movies/more-movie/more-movie.wxss */
@import "../movie-grid/movie-grid.wxss";
```

3.页面搭建完毕后，我们就需要分析一下如下问题：

* 我们需要哪个板块的内容信息？[正在热映， 即将上映， top250]  
* 页面标题需要动态的展示是哪个板块？[正在热映， 即将上映， top250]

分析的差不多了，剩下的就是一个个解决如上问题了，接下来就开始一步一步跟着我走吧！

4. 如何获取我们需要那个板块的电影信息？

分析：在`movies.js`中，我们在`onLoad`函数中调用了三次请求数据，而我们需要做的就是手动添加对应的标题到请求函数中，如下所示：
```javascript
onLoad(e) {
  let inTheaters = app.globalData.BASEPATH + "v2/movie/in_theaters",
  comeingSoon = app.globalData.BASEPATH + "v2/movie/coming_soon",
  top250 = app.globalData.BASEPATH + "v2/movie/top250";
  // 手动赋予对应请求的标题
  this.getData(inTheaters, "inTheaters", "正在热映");
  this.getData(comeingSoon, "comeingSoon", "即将上映");
  this.getData(top250, "top250", "TOP250");
}，
getData(url, setKey, slogans) {
  let that = this;
  wx.request({
    url: url,
    data: { count: 3 },
    header: { "Content-Type": "json" },
    success(res) {
      // 将标题传入处理电影信息的方法中
      that.processDoubanData(res.data.subjects, setKey, slogans);
    }
  });
},
processDoubanData(data, setKey, slogans) {
  let that = this;
  let movie = [];
  for (let subject of data) {
    let temp = {}
    temp.title = subject.title;
    temp.average = subject.rating.average.toFixed(1);
    temp.coverageUrl = subject.images.large;
    temp.movieId = subject.id;
    temp.stars = util.converToStarsArray(subject.rating.stars);
    movie.push(temp);
  }
  this.setData({
    [setKey]: {
      // 将标题传入处理电影信息对象中
      slogan: slogans,
      movies: movie
    }
  });
}
```
然后我们在`movie-list-template.wxml`中绑定上我们传过去的`slogan`值！
```html
<import src="../movie/movie-template.wxml" />
<template name="movieListTemplate">
    <view class="movie-list-container">
        <div class="inner-container">
                <view class="movie-head">
                <text class="slogan">{{slogan}}</text>
                // 给更多这个容器绑定上slogan，这样子我们就可以在点击更多后，在新页面得到这个值
                <view class="more" catchtap='onMoreTap' data-categroy="{{slogan}}">
                    <text class="more-text">更多</text>
                    <image class="more-img" src="/images/icon/arrow-right.png"></image>
                </view>
            </view>    
            <view class="movies-container">
                <block wx:for="{{movies}}" wx:for-item="movie">
                    <template is="movieTemplate" data="{{...movie}}" />
                </block>
            </view>
        </div>
    </view>
</template>
```

接下来我们就在更多那个页面来获取这值，并且展示：
`more-movie.js`
```javascript
onLoad(options) {
  // 获取点击更多传过来的我们绑定的标题slogan值
  let [that, categroy] = [this, options.categroy];
  this.data.barTitle = categroy;
},
onReady(event) {
  let that = this;
  // 设置导航标题
  wx.setNavigationBarTitle({
    title: that.data.barTitle
  })
}
```

5. 获取对应数据

&emsp;&emsp;我们在小程序中获取电影的次数有点多，所以我们在之前创建的`utils.js`中新创建一个函数，专门用来封装请求数据的方法，具体如下：
```javascript
function http(url, callBack) {
    let that = this;
    wx.request({
        url: url,
        header: { "Content-Type": "json" },
        success(res) {
            // 切记把值传给一个回调函数
            callBack(res.data);
        },
        fail(err){
            console.log(err)
        }
    });
}
```

在上面我们得到了本页的标题，所以我们可以根据这个标题来知道我们应该请求那个接口，如下所示：
```javascript
onLoad(options) {
  let [that, categroy] = [this, options.categroy];
  this.data.barTitle = categroy;
  // 定义一个接口路径的变量
  let interfaceUrl = null;
  // 根据标题判断请求路径
  switch (categroy) {
    case "正在热映":
      interfaceUrl = app.globalData.BASEPATH + "v2/movie/in_theaters";
      utils.http(interfaceUrl, that.precessDoubanData);
      break;
    case "即将上映":
      interfaceUrl = app.globalData.BASEPATH + "v2/movie/coming_soon";
      utils.http(interfaceUrl, that.precessDoubanData);
      break;
    default:
      interfaceUrl = app.globalData.BASEPATH + "v2/movie/top250";
      utils.http(interfaceUrl, that.precessDoubanData);
  }
  // 保存当前页面的数据请求地址，方便其他函数使用
  this.data.requestUrl = interfaceUrl;
},
precessDoubanData(data){
  let movie = [];
  for (let subject of data.subjects) {
    let temp = {}
    temp.title = subject.title;
    temp.average = subject.rating.average.toFixed(1);
    temp.coverageUrl = subject.images.large;
    temp.movieId = subject.id;
    temp.stars = utils.converToStarsArray(subject.rating.stars);
    movie.push(temp);
  }
  this.setData({
    movies: movie 
  })
}
```

接下来开始在模板页面`more-movie.wxml`中给template绑定上我们的值：
```wxml
<!--pages/movies/more-movie/more-movie.wxml-->
<import src="../movie-grid/movie-grid.wxml" />
<template is="movieGridTemplate" data="{{movies}}" />

```

最终，我们来查看一下效果：


![image.png](https://upload-images.jianshu.io/upload_images/8919399-ccd866fc924e8634.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

若有什么地方不一样的，可以自己修改一下样式表。

6. 上拉刷新和下拉加载

&emsp;&emsp;解析：上拉刷新原理就是在`movies.js`中记录总共请求的电影数量，然后执行刷新的时候，传入count=电影总数即可，下拉加载呢，就是每次请求的起点是目前请求的总数，而一次加载的数量自己决定，在这里，我以20条一次为例，具体代码如下：

###### 注意： 如果需要下拉刷新的页面，一定要在其json文件中声明，如下所示：
```json
{
    "navigationBarBackgroundColor": "#2c2e3b",\
    // 下拉的配置
    "enablePullDownRefresh": true
}
```

```javascript
// pages/movies/more-movie/more-movie.js
let utils = require("../../../utils/utils");
let app = getApp();
Page({
    data: {
        movies: [],
        totalCount: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let [that, categroy] = [this, options.categroy];
        this.data.barTitle = categroy;
        let interfaceUrl = null;
        switch (categroy) {
            case "正在热映":
                interfaceUrl = app.globalData.BASEPATH + "v2/movie/in_theaters";
                utils.http(interfaceUrl, that.precessDoubanData);
                break;
            case "即将上映":
                interfaceUrl = app.globalData.BASEPATH + "v2/movie/coming_soon";
                utils.http(interfaceUrl, that.precessDoubanData);
                break;
            default:
                interfaceUrl = app.globalData.BASEPATH + "v2/movie/top250";
                utils.http(interfaceUrl, that.precessDoubanData);
        }
        // 保存当前页面的数据请求地址，方便其他函数使用
        this.data.requestUrl = interfaceUrl;
    },
    onReady(event) {
        let that = this;
        wx.setNavigationBarTitle({
            title: that.data.barTitle
        })
    },
    precessDoubanData(data){
        let movie = [];
        for (let subject of data.subjects) {
            let temp = {}
            temp.title = subject.title;
            temp.average = subject.rating.average.toFixed(1);
            temp.coverageUrl = subject.images.large;
            temp.movieId = subject.id;
            temp.stars = utils.converToStarsArray(subject.rating.stars);
            movie.push(temp);
        }
        let moviesList = this.data.movies.concat(movie);
        this.setData({
            movies: moviesList
        })
        wx.hideNavigationBarLoading();
        // 保存当前电影总共条数，方便下拉加载使用
        this.data.totalCount += 20;
        // 去除下拉Loding
        wx.stopPullDownRefresh();
    },
    onPullDownRefresh(e){
        this.data.movies = [];
        let requestUrl = this.data.requestUrl + "?count=" + this.data.totalCount;
        utils.http(requestUrl, this.precessDoubanData);
        // 因为请求数据，就会自增20，所以我们在这里减去这20就可以达到我们想要的数据条数了
        this.data.totalCount -= 20;
    },
    onReachBottom(e){
        // 开启下拉加载时页面顶部的加载动效
        wx.showNavigationBarLoading();
        let requestUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        utils.http(requestUrl, this.precessDoubanData);
    }
})
```
这个时候我们的下拉刷新和上拉加载就完成了，效果如下：

![上拉刷新](https://upload-images.jianshu.io/upload_images/8919399-a0604eaaa46fdd98.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![下拉加载](https://upload-images.jianshu.io/upload_images/8919399-ffee82b058beaad6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


> 后言

本节知识点：
* 下拉刷新事件`onPullDownRefresh`，切记json文件中配置下拉刷新的开关`enablePullDownRefresh`
* 上拉加载事件`onReachBottom`
*  Loading加载效果`wx.showNavigationBarLoading()`和关闭Loading的函数`wx.stopPullDownRefresh()`

希望大家可以多练习，好好消化，下节课我们将会讲到如何根据搜索模糊查询电影！

##### 项目源码：[demigod-liu / wechat](https://github.com/demigod-liu/wechat-mini-program)

> 说明

原创作品，禁止转载和伪原创，违者必究！