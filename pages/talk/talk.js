let tolkData = require("talk-data/talk-data");
Page({
    data: {},
    onLoad(options){
      // 模拟获取后台数据
      this.setData(tolkData);
    },
    onShareAppMessage(){
        let that = this;
        let shareObj = {
            title: "影视大爆炸社区爆文",
            path: '/pages/talk/talk',
            success(res){
                // 转发成功之后的回调
            },
            fail(res){
                // 转发失败之后的回调
                if(res.errMsg == 'shareAppMessage:fail cancel'){
                    // 用户取消转发
                }else if(res.errMsg == 'shareAppMessage:fail'){
                    // 转发失败，其中  为详细失败信息
                }
            },
            complete(){
            // 转发结束之后的回调（转发成不成功都会执行）
            }
        };
        return shareObj;
    },
    likeThis(e){
        let [that,index] = [
            this,
            -- e.target.dataset.id
        ];
        let status = that.data.articleList[index].canLike;
        if(status){
            let likeCount = that.data.articleList[index].likes;
            that.setData({
                ["articleList["+index+"].likes"]: ++ likeCount,
                ["articleList["+index+"].canLike"]: false
            })
        }else{
            wx.showToast({
                title: '您已经点过赞啦~',
                icon: "none",
                duration: 2000
            })
        }
    },
    details(e){
        let aid = e.currentTarget.dataset.aid;
        wx.navigateTo({
            url: "../talk-details/talk-details?aid="+aid
        })
    }
});