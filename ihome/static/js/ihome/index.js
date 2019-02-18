//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function setStartDate() {
    var startDate = $("#start-date-input").val();
    if (startDate) {
        $(".search-btn").attr("start-date", startDate);
        $("#start-date-btn").html(startDate);
        $("#end-date").datepicker("destroy");
        $("#end-date-btn").html("离开日期");
        $("#end-date-input").val("");
        $(".search-btn").attr("end-date", "");
        $("#end-date").datepicker({
            language: "zh-CN",
            keyboardNavigation: false,
            startDate: startDate,
            format: "yyyy-mm-dd"
        });
        $("#end-date").on("changeDate", function() {
            $("#end-date-input").val(
                $(this).datepicker("getFormattedDate")
            );
        });
        $(".end-date").show();
    }
    $("#start-date-modal").modal("hide");
}

function setEndDate() {
    var endDate = $("#end-date-input").val();
    if (endDate) {
        $(".search-btn").attr("end-date", endDate);
        $("#end-date-btn").html(endDate);
    }
    $("#end-date-modal").modal("hide");
}

function goToSearchPage(th) {
    var url = "/house/search/?";
    url += ("aid=" + $(th).attr("area-id"));
    url += "&";
    var areaName = $(th).attr("area-name");
    if (undefined == areaName) areaName="";
    url += ("aname=" + areaName);
    url += "&";
    url += ("sd=" + $(th).attr("start-date"));
    url += "&";
    url += ("ed=" + $(th).attr("end-date"));
    location.href = url;
}

$(document).ready(function(){
    $(".top-bar>.register-login").show();
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationClickable: true
    }); 
    // $(".area-list a").click(function(e){
    //     $("#area-btn").html($(this).html());
    //     $(".search-btn").attr("area-id", $(this).attr("area-id"));
    //     $(".search-btn").attr("area-name", $(this).html());
    //     $("#area-modal").modal("hide");
    // });
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);               //当窗口大小变化的时候
    $("#start-date").datepicker({
        language: "zh-CN",
        keyboardNavigation: false,
        startDate: "today",
        format: "yyyy-mm-dd"
    });
    $("#start-date").on("changeDate", function() {
        var date = $(this).datepicker("getFormattedDate");
        $("#start-date-input").val(date);
    });


    $.get("/house/my_index/", function (data) {
        if(data.code == 200){
            //渲染图片
            for(var index=0;index<data.data.houses.length;index++){
                var house = data.data.houses[index]
                var houseNode = $('<div class="swiper-slide">\n' +
                    '<a href="/house/detail/?house_id='+house.house_id+'"><img src="/static/media/'+house.imag+'"></a>\n' +
                    '<div class="slide-title">'+house.title+'</div>\n' +
                    '</div>')
                $('.swiper-wrapper').append(houseNode)
            }


            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });


            //渲染位置
            for(var i=0;i<data.data.area.length;i++){
                var are = data.data.area[i]
                var areaNode = $('<a style="cursor: pointer" area-id="'+are.id+'">'+are.name+'</a>')
                $('.area-list').append(areaNode)
            }
            //位置栏选择样式
            $(".area-list a").click(function(e){
                $("#area-btn").html($(this).html());
                $(".search-btn").attr("area-id", $(this).attr("area-id"));
                $(".search-btn").attr("area-name", $(this).html());
                $("#area-modal").modal("hide");
            });


            //隐藏登陆及注册按钮
            var user_name = data.data.user_name
            if(user_name){
                $('.top-btn').hide()
                var userNode = $('<h3 style="font-size: 20px;">欢迎'+user_name+'来到爱家</h3>')
                $('.register-login').append(userNode)
            }

        }
    })


})