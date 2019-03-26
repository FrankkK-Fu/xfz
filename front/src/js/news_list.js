
function CMSNewsList() {
    
}

CMSNewsList.prototype.initDatePicker = function(){
    var startPicker = $('#start-picker');
    var endPicker = $('#end-picker');

    var todayDate = new Date();
    var todayStr = todayDate.getFullYear() + '/' + (todayDate.getMonth()+1) + '/' + todayDate.getDate();
    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2017/6/1',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': 'linked',
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true
    };

    startPicker.datepicker(options);
    endPicker.datepicker(options);
};

CMSNewsList.prototype.listenDeleteEvent = function(){
    var deleteBtns = $('.delete-btn');
    deleteBtns.click(function () {
        var btn = $(this);//当前按钮，这里面绑定了多个删除按钮
        var news_id = btn.attr('data-news-id');
        xfzalert.alertConfirm({
            'text': '您是否要删除这篇新闻吗？',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_news/',
                    'data': {
                        'news_id': news_id
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            //这个和window.location.reload()是一样的，但后者在火狐中不刷新
                            window.location = window.location.href;
                        }
                    }
                });
            }
        });

    });

};

CMSNewsList.prototype.run = function () {
    this.initDatePicker();
    this.listenDeleteEvent();
};

$(function () {
    var newslist = new CMSNewsList();
    newslist.run();
})