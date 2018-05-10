let util = require("../../utils/utils");
let app = getApp();
Page({
    data: {
        containerShow: true,
        searchPanelShow: false,
        closeImgShow: false
    },
    onLoad(e) {
        let inTheaters = app.globalData.BASEPATH + "v2/movie/in_theaters",
            comeingSoon = app.globalData.BASEPATH + "v2/movie/coming_soon",
            top250 = app.globalData.BASEPATH + "v2/movie/top250";
        this.getData(inTheaters, "inTheaters", "正在热映");
        this.getData(comeingSoon, "comeingSoon", "即将上映");
        this.getData(top250, "top250", "TOP250");

    },
    getData(url, setKey, slogans) {
        let that = this;
        wx.request({
            url: url,
            data: { count: 3 },
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
    },
    onMoreTap(e){
        let categroy = e.currentTarget.dataset.categroy;
        wx.navigateTo({
            url: 'more-movie/more-movie?categroy=' + categroy,
        })
    },
    onBindFocus(){
        this.setData({
            containerShow: false,
            searchPanelShow: true,
            closeImgShow: true
        })
    },
    recover(){
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            closeImgShow: false
        })
    },
    onBindChange(){

    }
})