
function Banners() {

}

Banners.prototype.createBannerItem = function(banner){
    var self = this
    var tpl = template("banner-item", {"banner": banner});
    var bannerListGroup = $('.banner-list-group');
    var bannerItem = null

    if (banner){
        bannerListGroup.append(tpl);//这样是为了定位到需要修改和保存的那个banneritem
        bannerItem = bannerListGroup.find('.banner-item:last');
    }else {
        bannerListGroup.prepend(tpl);
        bannerItem = bannerListGroup.find('.banner-item:first');
    }

    //这里需要先加进去bannerListGroup才能继续绑定事件
    self.addImageSelectEvent(bannerItem);
    self.addRemoveBannerEvent(bannerItem);
    self.addSaveBannerEvent(bannerItem);
};

Banners.prototype.listenAddBannerEvent = function(){
    var self =this;
    var addBtn = $('#add-banner-btn');

    addBtn.click(function () {
        var bannerListGroup = $('.banner-list-group');
        var length = bannerListGroup.children().length;
        if (length >= 6) {
            window.messageBox.showInfo('最多只能6张轮播图');
            return;
        }
        self.createBannerItem();

    });
};

Banners.prototype.addImageSelectEvent = function(bannerItem){
    var image = bannerItem.find('.thumbnail');
    var imageInput = bannerItem.find('.image-input');
    image.click(function () {
        imageInput.click();//将点击图片和点击input绑定
    });

    imageInput.change(function () {
        var file = this.files[0]; //第一个文件
        var formData = new FormData();
        formData.append("file",file);
        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] === 200){
                    var url = result['data']['url'];
                    image.attr('src',url); //这里改变了图片的URL也就是改变了图片
                }
            }
        });

    });
};

Banners.prototype.addRemoveBannerEvent = function(bannerItem){
    var closeBtn = bannerItem.find('.close-btn');

    closeBtn.click(function () {
        var bannerId = bannerItem.attr("data-banner-id");
        if (bannerId) {
            xfzalert.alertConfirm({
                'text': '您确定要删除这个轮播图吗?',
                'confirmCallback': function () {
                    xfzajax.post({
                        'url': '/cms/delete_banner/',
                        'data': {
                            'banner_id': bannerId
                        },
                        'success': function (result) {
                            if (result['code'] === 200){
                                bannerItem.remove();
                                window.messageBox.showSuccess('轮播图删除才成功！');
                            }
                        }
                    });
                },
            });
        } else {
            bannerItem.remove();
        }
    });

};

Banners.prototype.loadData = function(){
    var self = this;
    xfzajax.get({
        'url': '/cms/banner_list/',
        'success': function (result) {
            if (result['code'] === 200){
                var banners = result['data']; //这里表示查看数据库中有多少个banner，然后插入
                for (var i=0; i<banners.length; i++){
                    var banner = banners[i]; //第i个banner
                    self.createBannerItem(banner);
                }
            }
        }
    });
};

Banners.prototype.addSaveBannerEvent = function(bannerItem){
    var saveBtn = bannerItem.find('.save-btn');
    var imageTag = bannerItem.find(".thumbnail");
    var priorityTag = bannerItem.find("input[name='priority']");
    var linktoTag = bannerItem.find("input[name='link_to']");
    var prioritySpan = bannerItem.find('span[class="priority"]');
    var bannerId = bannerItem.attr("data-banner-id");
    var url = '';
    if (bannerId){
        url = '/cms/edit_banner/';
    }else {
        url = '/cms/add_banner/';
    }

    saveBtn.click(function () {
        var image_url = imageTag.attr('src');
        var priority = priorityTag.val();
        var link_to = linktoTag.val();

        xfzajax.post({
            'url': url,
            'data': {
                'image_url': image_url,
                'priority': priority,
                'link_to': link_to,
                'pk': bannerId
            },
            'success': function (result) {
                if (result['code'] === 200){
                    if (bannerId) {
                        window.messageBox.showSuccess('轮播图修改成功');
                    } else {

                        bannerId = result['data']['banner_id'];//这里需要获得PK的值
                        bannerItem.attr('data-banner-id',bannerId);//插入PK值
                        window.messageBox.showSuccess('轮播图添加完成！');
                    }
                    prioritySpan.text("优先级："+priority);
                }
            }
        });
    });
};

Banners.prototype.run = function () {
    this.listenAddBannerEvent();
    this.loadData();
};

$(function () {
   var banners = new Banners();
   banners.run();
});