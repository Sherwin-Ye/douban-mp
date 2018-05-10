function converToStarsArray(stars) {
    let num = parseInt(stars.toString().substr(0, 1));
    let arr = [], temp = 0;
    for (let i = 0; i < 5; i++) {
        temp = i >= num ? 0 : 1;
        arr.push(temp);
    }
    return arr;
}
function http(url, callBack) {
    let that = this;
    wx.request({
        url: url,
        header: { "Content-Type": "json" },
        success(res) {
            callBack(res.data);
        },
        fail(err){
            console.log(err)
        }
    });
}
function convertToCastString(casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
    var castsArray = []
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    converToStarsArray: converToStarsArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
}