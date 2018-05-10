// pages/movies/movie-detail/movie-detail.js
let utils = require("../../../utils/utils");
let app = getApp();
Page({
    data: {
        movie: {}
    },
    onLoad(options) {
        let movieId = options.mid;
        let requestUrl = app.globalData.BASEPATH + "v2/movie/subject/" + movieId;
        utils.http(requestUrl, this.processDoubanData);
    },
    processDoubanData(data) {
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
            generes: data.genres.join(" / "),
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
    },
    viewMoviePostImg: function (e) {
        var src = e.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src]
        })
    }
})