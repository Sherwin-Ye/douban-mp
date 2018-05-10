# 微信小程序入门级教程-12

> 前言

&emsp;&emsp;昨天我们讲解了更多页面和其功能的实现，说的有点笼统，不过大致方向和代码都已经基本提供了，所以希望大家还是没懂的就多理解理解，练习练习，今天呢，我们就开始讲解电影页面的搜索功能！

> 目录

https://www.jianshu.com/p/9c9b555b52e8

> 分析操作

1. 搜索框获取焦点后，自动弹出搜索页面，隐藏掉原有页面，并且搜索框右边出现关闭搜索的按钮。
2. 点击关闭按钮，页面初始化，关闭按钮也随之消失

具体操作效果：
![交互效果](https://upload-images.jianshu.io/upload_images/8919399-5ff19eca27001b5b.gif?imageMogr2/auto-orient/strip)


> 实现步骤

1.电影页面顶部新增一个搜索栏，对于搜索栏中的搜索图标和关闭图标，有很多种办法可以解决，例如图片，又或者iconfont，又或者小程序自身的icon图标，方法有很多，怎么实现，看自己考虑了。我们这里就采取最简单的方法，直接使用小程序自身的icon，具体使用如下：

|属性名|类型|默认值|说明|
|:---|:---|:---|:---|
|type|String||有效值：success, success_no_circle, info, warn, waiting, cancel, download, search, clear|
|size|Number|23|icon的大小，单位px
|color|Color||icon的颜色，同css的color

举例：

```wxml
<icon type="success" size="40" color="#f00"/>
```
```javascript
Page({
  data: {
    iconSize: [20, 30, 40, 50, 60, 70],
    iconColor: [
      'red', 'orange', 'yellow', 'green', 
      'rgb(0,255,255)', 'blue', 'purple'
    ],
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 
      'waiting', 'cancel', 'download', 'search', 'clear'
    ]
  }
})
```
![微信API例子](https://upload-images.jianshu.io/upload_images/8919399-21662caffd1a86c8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.在这里我们就开始修改`movies.wxml`文件在`.container`上方新增`view`，具体代码如下:
```html
 <view class="search">
    <icon type="search" class="search-img" size="14" color="#405f80" />
    <input type="text" placeholder='唐人街探案2' 
        placeholder-class='placeholader' bindfocus="onBindFocus"
        bindconfirm="onSearch" />
    // 初始化的时候将关闭按钮隐藏掉
    // 在movies.js中定义一个变量closeImgShow，赋值false
    <icon type="clear" class="clear-img" size="14" 
      color="#405f80" catchtap='recover' wx-if="{{closeImgShow}}" />
</view> 
// 关于input的属性就自己去看API文档吧，这里不多说这个东西了
```

效果如下：
![搜索框](https://upload-images.jianshu.io/upload_images/8919399-e26e41fe020685dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3.继续写我们搜索的结果页面，这里我们就不用重新写页面了，因为搜索结果页面无非也是`grid`模板的内容，所以这里我们继续使用`grid`模板，所以我们直接在`movies.wxml`页面最下部新增一个`view`，具体代码如下：
```html
// 初始化页面的时候，搜索页面时隐藏的
// 所以在movies.js中新增一个变量searchPanelShow， 赋值false
<view class='search-panel' wx-if="{{searchPanelShow}}">
    <template is="movieGridTemplate"></template>
</view> 
```

4.开始写功能部分

我们在上面可以看到，我们给输入框加了两个事件,一个是获取焦点的事件，我们刚才已经用来实现页面的隐藏和显示了，那么解下来的`confirm`呢？就是关于输入框输入内容后的点击完成事件，当然了，回车也是可以的，那么我们先在`movies.js`中写出这个函数再说，顺便通过`event.detail.value`来获取输入框的值：
```javascript
onSearch(e){
  // 获取输入框的值
  let val = e.detail.value; 
  // 通过api接口传入这个值进行搜索
  let searchUrl = app.globalData.BASEPATH + "v2/movie/search?q=" + val;
  // 使用调用接口后的处理方法，把搜索结果赋值给变量searchMovies
  this.getData(searchUrl,'searchMovies','');
}
```

在上面我们得到了搜索结果的一个变量，那么接下来就是在页面中填充这个值:

```wxml
 <view class='search-panel' wx-if="{{searchPanelShow}}">
    <template is="movieGridTemplate" data="{{...searchMovies}}"></template>
</view> 
```

###### 注意：

* 如果这里搜索出来只有三条数据，那么请把`movies.js`中的`getData`函数中传入的count=3删除，为了保持原有效果不变，可以在`onLoad`函数中，把初始化页面的三次请求路径后面，直接以问号传参的方式传入count=3

* 如果页面中样式有问题，请在`movies.wxss`中引入我们使用grid模板的样式文件即可。

搜索效果：![搜索效果](https://upload-images.jianshu.io/upload_images/8919399-0ebe2f1b67179436.gif?imageMogr2/auto-orient/strip)

###### 优化：

&emsp;&emsp;在这里搜索时，没有任何交互效果，页面比较生硬，我们可以利用上节课学的上拉加载的那个Loading样式【导航标题出现Loading效果】，来增强体验，效果如下：

![增加交互](https://upload-images.jianshu.io/upload_images/8919399-8bf4377bd2c64db9.gif?imageMogr2/auto-orient/strip)

5. 本节课关于搜索的问题就讲完了，对于搜索结果只有20条数据的问题，大家可以自己去实现以下下拉加载和刷新的效果，这里就不挨着挨着说了，之前更多里面也讲了此类方法的实现。在最后呢，我发现在之前的文章详情页面里面，有一个bug，就是音乐播放完毕的时候，图标不会初始化，并且全局变量也没有修改，所以在这里，我们给文章详情页面新增一个关于音乐播放完毕的监听事件: 
```javascript
// 监听音乐停止，图标初始化
wx.onBackgroundAudioStop(function(){
  that.setData({
    isPlaying: false
  })
  app.globalData.ISPLAYING = false;
  app.globalData.MUSICID = null;
})
```

> 后言

##### 项目源码：[demigod-liu / wechat](https://link.jianshu.com/?t=https%3A%2F%2Fgithub.com%2Fdemigod-liu%2Fwechat-mini-program)


> 说明

原创作品，禁止转载和伪原创，违者必究！

