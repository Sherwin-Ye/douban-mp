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
module.exports = {
    converToStarsArray: converToStarsArray,
    http: http
}