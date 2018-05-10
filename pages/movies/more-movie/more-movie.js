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
        this.data.totalCount -= 20;
    },
    onReachBottom(e){
        wx.showNavigationBarLoading();
        let requestUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        utils.http(requestUrl, this.precessDoubanData);
    },
    onMovieTap(e) {
        let mid = e.currentTarget.dataset.mid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?mid=' + mid
        })
    }
})