function Banner() {
    this.bannerWidth = 798;
    this.bannerGroup = $("#banner-group");
    this.index = 1;
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUl = $("#banner-ul");
    this.liList = this.bannerUl.children("li");
    this.bannerCount = this.liList.length;
    this.pageControl = $(".page-control");

};

Banner.prototype.initBanner = function (){
    var self = this;
    var firstBanner = self.liList.eq(0).clone();

    var lastBanner = self.liList.eq(self.bannerCount - 1).clone();
    self.bannerUl.append(firstBanner);
    self.bannerUl.prepend(lastBanner);
    self.bannerUl.css({"width":self.bannerWidth*(self.bannerCount + 2),"left":-self.bannerWidth});

};

Banner.prototype.initPageControl = function (){
    var self = this;
    // var pageContron = $(".page-control");
    for (var i=0;i<this.bannerCount;i++) {
        var circle = $("<li></li>");
        self.pageControl.append(circle);
        if (i === 0){
            circle.addClass("active");
        }
    }
    self.pageControl.css({"width":self.bannerCount*12+8*2+(self.bannerCount-1)*16})
};

Banner.prototype.toggleArrow = function (show) {
    var self = this;
    if (show){
        self.leftArrow.show();
        self.rightArrow.show();
    }else {
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};

Banner.prototype.animate = function () {
    var self = this;
    self.bannerUl.stop().animate({"left":-798*self.index},500);
    var index = self.index;
    if (index ===0){
        index = self.bannerCount - 1;
    }else if (index === self.bannerCount + 1){
        index = 0;
    }else {
        index = self.index - 1;
    }
    self.pageControl.children("li").eq(index).addClass("active").siblings().removeClass("active");
};

Banner.prototype.loop = function () {
    var self = this;
    this.timer = setInterval(function () {
        if (self.index >= self.bannerCount+1){
            self.bannerUl.css({"left":-self.bannerWidth});
            self.index = 2;
        }else {
            self.index++;
        }
       self.animate();
    },2000);
};

Banner.prototype.listenArrowClick = function (){
    var self = this;
    self.leftArrow.click(function () {
        if (self.index === 0){
            self.bannerUl.css({"left":-self.bannerCount*self.bannerWidth});
            self.index = self.bannerCount - 1;
        }else {
            self.index--;
        }
        self.animate();
    });

    self.rightArrow.click(function () {
        if (self.index === self.bannerCount + 1){
            self.bannerUl.css({"left":-self.bannerWidth});
            self.index = 2;
        }else {
            self.index++;
        }
        self.animate();
    });
};

Banner.prototype.listenBannerHover = function () {
    var self = this;
    this.bannerGroup.hover(function () {
    //第一个函数，把鼠标移到banner里的时候触发
    clearInterval(self.timer);
    self.toggleArrow(true);
    },function () {
    //第二个函数，鼠标离开banner的时候触发
    self.loop();
    self.toggleArrow(false);
    });
};

Banner.prototype.listenPageControl = function(){
    var self = this;
    self.pageControl.children("li").each(function (index,obj) {
        $(obj).click(function () {
            self.index = index + 1;
            self.animate();

        });
    });
};

Banner.prototype.run = function () {
    this.initBanner();
    this.initPageControl();
    this.loop();
    this.listenBannerHover();
    this.listenArrowClick();
    this.listenPageControl();
};

function Index(){
    var self = this;
    self.page = 2;
    self.category_id = 0;
    self.loadBtn = $('#load-more-btn'); //直接定义成属性


}

Index.prototype.listenLoadMoreEvent = function(){
    var self = this;
    var loadBtn = $('#load-more-btn');
    loadBtn.click(function () {
        xfzajax.get({
            'url':'/news/list/',
            'data':{
                'p': self.page,
                'category_id': self.category_id
            },
            'success':function (result) {
                if (result['code'] === 200){
                    var newses = result['data'];
                    if (newses.length > 0){
                        var tpl = template('news-item',{'newses':newses}); //这里就是加载更多按下后出现的新增的内容，也就是li里面的内容
                        var ul = $('.list-inner-group');
                        ul.append(tpl);
                        self.page += 1;
                    } else {
                        loadBtn.hide();
                    }

                }
            }
        });
    });

};

Index.prototype.listenCategorySwitchEvent = function(){
    var self = this;
    var tabGroup = $('.list-tab');
    tabGroup.children().click(function () {
        var li = $(this); //这样写在点击的时候会确定是哪个li
        var category_id = li.attr('data-category');
        var page = 1;
        xfzajax.get({
            'url': '/news/list/',
            'data': {
              'category_id':category_id,
                'p':page
            },
            'success': function (result) {
                if (result['code'] === 200){
                    var newses = result['data'];
                    var tpl = template('news-item',{'newses':newses});

                    //先清空ul内的东西
                    var newsListGroup = $('.list-inner-group');
                    newsListGroup.empty();
                    newsListGroup.append(tpl);
                    self.page = 2;
                    self.category_id = category_id;

                    li.addClass('active').siblings().removeClass('active');
                    self.loadBtn.show();


                }
            }
        });
    });
};

Index.prototype.run = function(){
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();
};

//浏览器运行时自动加载
$(function () {
    var banner = new Banner();
    banner.run();

    var index = new Index();
    index.run();
});



