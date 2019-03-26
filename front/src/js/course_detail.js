function CourseDetail() {
    
}

CourseDetail.prototype.initPlayer = function(){
    var videoInfoSpan = $('#video-info');
    var video_url = videoInfoSpan.attr("data-video-url");
    var cover_url = videoInfoSpan.attr("data-cover-url");


    var player = cyberplayer("playercontainer").setup({
        width: '100%',
        height: '100%',
        file: video_url,
        image: cover_url,
        autostart: false,
        stretching: "uniform",
        repeat: false,
        volume: 100,
        controls: true,
        tokenEncrypt: "true",
        // AccessKey
        ak: '85102afa4256482986d50c8b4e4e2233'
    });

    player.on('beforePlay', function (e) {
        if (!/m3u8/.test(e.file)) {
            return;
        }
        xfzajax.get({
            // 获取token的url
            'url': '/course/course_token/',
            'data': {
                'video': video_url
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var token = result['data']['token'];
                    player.setToken(e.file, token);
                } else {
                    alert('token错误！');
                }
            },
            'fail': function (error) {
                console.log(error);
            }
        });
    });
};

CourseDetail.prototype.run = function () {
    this.initPlayer();
};

$(function () {
   var courseDetail = new CourseDetail();
   courseDetail.run();
});
