# 微信小程序入门级教程-13


> 前言

搜索功能做完了，本节课我们开始写电影详情的功能了~

> 目录

https://www.jianshu.com/p/9c9b555b52e8

> 步骤

1. `movies`文件夹下新建`movie-detail`文件，并且把对应的文件全部建好。

2. 在电影模板`movie-template.wxml`中给每一个电影的`view`上增加一个点击事件，并且绑定上电影的`ID`，然后在点击事件中跳转到`movie-details.wxml`页面，并且在`movie-details.js`的`onLoad`函数中获取传过来的电影`ID`，并且引入utils工具类的http函数，请求豆瓣的api接口获取电影详情，具体代码如下：
```javascript
// pages/movies/movie-detail/movie-detail.js
let utils = require("../../../utils/utils");
let app = getApp();
Page({
  onLoad(options) {
      let movieId = options.mid;
      let requestUrl = app.globalData.BASEPATH + "v2/movie/subject/" + movieId;
      utils.http(requestUrl, this.processDoubanData);
  },
  processDoubanData(data){
      console.log(data)
  }
})
```

3.因为电影详情中有很多二级数据和三级数据，所以必要的判空操作还是必要的，毕竟老电影的话，很有可能内容不全，这些错误都将导致小程序报错，所以我们来优化一下数据：
```javascript
processDoubanData(data) {
  // 判空操作并且格式化我们需要的数据到变量movie
  if(!data){
    return false;
  }
  let director = {
    avatar: "",
    name: "",
    id: ""
  }
  if (data.directors[0] != null) {
    if (data.directors[0].avatars != null) {
      director.avatar = data.directors[0].avatars.large
    }
    director.name = data.directors[0].name;
    director.id = data.directors[0].id;
  }
  var movie = {
    movieImg: data.images ? data.images.large : "",
    country: data.countries[0],
    title: data.title,
    originalTitle: data.original_title,
    wishCount: data.wish_count,
    commentCount: data.comments_count,
    year: data.year,
    generes: data.genres.join("、"),
    stars: utils.converToStarsArray(data.rating.stars),
    score: data.rating.average,
    director: director,
    casts: utils.convertToCastString(data.casts),
    castsInfo: utils.convertToCastInfos(data.casts),
    summary: data.summary
  }
  this.setData({
    movie: movie
  })
}
```

4.然后我们来编写页面和页面的样式
`movie-detail.wxml`
```html
<import src="../stars/stars-template.wxml" />
<view class="container">
    <image class="head-img" src="{{movie.movieImg}}" mode="aspectFill" />
    <view class="head-img-hover" data-src="{{movie.movieImg}}" catchtap="viewMoviePostImg">
        <text class="main-title">{{movie.title}}</text>
        <text class="sub-title">{{movie.country + " · "+movie.year}}</text>
        <view class="like">
            <text class="highlight-font">
        {{movie.wishCount}}
      </text>
            <text class="plain-font">
        人喜欢
      </text>
            <text class="highlight-font">
        {{movie.commentCount}}
      </text>
            <text class="plain-font">
        条评论
      </text>
        </view>
    </view>
    <image class="movie-img" src="{{movie.movieImg}}" data-src="{{movie.movieImg}}" catchtap="viewMoviePostImg" />
    <view class="summary">
        <view class="original-title">
            <text>{{movie.originalTitle}}</text>
        </view>
        <view class="flex-row">
            <text class="mark">评分</text>
            <view class="star-box">
                <template is="starsTemplate" data="{{stars:movie.stars, score:movie.score}}" />
            </view>
        </view>
        <view class="flex-row">
            <text class="mark">导演</text>
            <text>{{movie.director.name}}</text>
        </view>
        <view class="flex-row">
            <text class="mark">影人</text>
            <text>{{movie.casts}}</text>
        </view>
        <view class="flex-row">
            <text class="mark">类型</text>
            <text>{{movie.generes}}</text>
        </view>
    </view>
    <view class="hr"></view>
    <view class="synopsis">
        <text class="synopsis-font">剧情简介</text>
        <text class="summary-content">{{movie.summary}}</text>
    </view>
    <view class="hr"></view>
    <view class="cast">
        <text class="cast-font"> 影人</text>
        <scroll-view class="cast-imgs" scroll-x="true" style="width:100%">
            <block wx:for="{{movie.castsInfo}}" wx:for-item="item">
                <view class="cast-container">
                    <image class="cast-img" src="{{item.img}}"></image>
                    <text class="cast-name">{{item.name}}</text>
                </view>
            </block>
        </scroll-view>
    </view>
</view>
```
`movie-detail.wxss`
```css
@import "../stars/stars-template.wxss";

.container {
    display: flex;
    flex-direction: column;
    font-size: 26rpx;
}

.head-img {
    width: 100%;
    height: 320rpx;
    -webkit-filter: blur(20px);
}

.head-img-hover {
    width: 100%;
    height: 320rpx;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
}

.main-title {
    font-size: 19px;
    color: #fff;
    font-weight: bold;
    margin-top: 50rpx;
    margin-left: 40rpx;
    letter-spacing: 2px;
}

.sub-title {
    font-size: 28rpx;
    color: #fff;
    margin-left: 40rpx;
    margin-top: 30rpx;
}

.like {
    display: flex;
    flex-direction: row;
    margin-top: 30rpx;
    margin-left: 40rpx;
}

.highlight-font {
    color: #f21146;
    font-size: 22rpx;
    margin-right: 10rpx;
}

.plain-font {
    color: #666;
    font-size: 22rpx;
    margin-right: 30rpx;
}

.movie-img {
    height: 238rpx;
    width: 175rpx;
    position: absolute;
    top: 160rpx;
    right: 30rpx;
    box-shadow: 1px 1px 6px 0 #000;
}

.summary {
    margin: 40rpx;
    margin-bottom: 0;
    color: #777;
}

.original-title {
    color: #1f3463;
    font-size: 24rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
}

.flex-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 10rpx;
}

.mark {
    margin-right: 30rpx;
    white-space: nowrap;
    color: #999;
}

.star-box {
    margin-top: -5rpx;
}

.hr {
    margin-top: 45rpx;
    height: 1px;
    width: 100%;
    border-bottom: 1px dashed #d9d9d9;
}

.synopsis {
    margin-left: 40rpx;
    display: flex;
    flex-direction: column;
    margin-top: 50rpx;
}

.synopsis-font {
    color: #999;
}

.summary-content {
    margin-top: 20rpx;
    margin-right: 40rpx;
    line-height: 40rpx;
    letter-spacing: 1px;
}

.cast {
    margin: 0 40rpx;
    display: flex;
    flex-direction: column;
    margin-top: 50rpx;
}

.cast-font {
    color: #999;
    margin-bottom: 40rpx;
}

.cast-container {
    display: inline-flex;
    flex-direction: column;
    margin-bottom: 50rpx;
    margin-right: 40rpx;
    width: 160rpx;
    text-align: center;
    white-space: normal;
}

.cast-imgs {
    white-space: nowrap;
}

.cast-img {
    width: 160rpx;
    height: 210rpx;
}

.cast-name {
    margin: 10rpx auto;
}

```

看一下效果吧：

![最终效果图](https://upload-images.jianshu.io/upload_images/8919399-8083cffbd9d1b894.gif?imageMogr2/auto-orient/strip)

5. 但是我们会发现，如果我们进入了更多页面，那么点击电影，就不会跳转到详情页面，是因为在`more-movie.js`中。我们并没有`onMovieTap`函数，所以我们把`movies.js`中的`onMovieTap`函数复制到`more-movie.js`中即可在更多页面里，也可以调整到详情页面。

6.最后我们再给电影封面加一个预览的功能，就是点击详情页封面图和背景图，可以预览一下大图，即实现页面中的`viewMoviePostImg`函数：
`movie-detail.js`
```javascript
viewMoviePostImg: function (e) {
  var src = e.currentTarget.dataset.src;
  // 小程序预览的方法
  wx.previewImage({
    current: src, // 图片路径
    urls: [src] // 图片相册的数组
  })
}
```

效果如下：

![预览效果](https://upload-images.jianshu.io/upload_images/8919399-cff7c77d7b488f3c.gif?imageMogr2/auto-orient/strip)

> 后言

&emsp;&emsp;到最后呢，大体内容我们就学习的差不多的，剩下的就是自己优化小程序和随着小程序API的更新换代，自己可以继续实时的优化小程序，谢谢大家

##### 项目源码：[demigod-liu / douban-movies](https://link.jianshu.com/?t=https%3A%2F%2Fgithub.com%2Fdemigod-liu%2Fdouban-movies)

> 说明

原创作品，禁止转载和伪原创，违者必究！

