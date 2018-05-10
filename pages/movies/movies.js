let util = require("../../utils/utils");
let app = getApp();
Page({
    data: {
        containerShow: true,
        searchPanelShow: false,
        closeImgShow: false,
        searchMovies: {}
    },
    onLoad(e) {
        let inTheaters = app.globalData.BASEPATH + "v2/movie/in_theaters?count=3",
            comeingSoon = app.globalData.BASEPATH + "v2/movie/coming_soon?count=3",
            top250 = app.globalData.BASEPATH + "v2/movie/top250?count=3";
        this.getData(inTheaters, "inTheaters", "正在热映");
        this.getData(comeingSoon, "comeingSoon", "即将上映");
        this.getData(top250, "top250", "TOP250");

    },
    getData(url, setKey, slogans) {
        let that = this;
        wx.request({
            url: url,
            header: { "Content-Type": "json" },
            success(res) {
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
                slogan: slogans,
                movies: movie
            }
        });
        wx.hideNavigationBarLoading();
    },
    onMoreTap(e) {
        let categroy = e.currentTarget.dataset.categroy;
        wx.navigateTo({
            url: 'more-movie/more-movie?categroy=' + categroy,
        })
    },
    onBindFocus() {
        this.setData({
            containerShow: false,
            searchPanelShow: true,
            closeImgShow: true
        })
    },
    recover() {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            closeImgShow: false
        })
    },
    onSearch(e) {
        wx.showNavigationBarLoading();
        let val = e.detail.value;
        let searchUrl = app.globalData.BASEPATH + "v2/movie/search?count=50&q=" + val;
        this.getData(searchUrl, 'searchMovies', '');
    },
    onMovieTap(e) {
        let mid = e.currentTarget.dataset.mid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?mid=' + mid
        })
    }
})