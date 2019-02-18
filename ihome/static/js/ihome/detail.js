function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    })
    $(".book-house").show();

})


$.get("/house/detail/", function (data) {
    var search = document.location.search
    id = search.split('=')[1]
    $.get("/house/detail/"+id+"/", function (data) {
        var banner_image = ''
        for(var i=0; i<data.detail.images.length; i++){
            banner_li = '<li class="swiper-slide"><img src="/static/media/' + data.detail.images[i] +'"></li>'
            banner_image += banner_li
        }
        $('.swiper-wrapper').html(banner_image)
        //轮播效果
        var mySwiper = new Swiper ('.swiper-container', {
            loop: true,
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            pagination: '.swiper-pagination',
            paginationType: 'fraction'
        })

        $('.house-price span').html(data.detail.price)
        $('.house-title').html(data.detail.title)
        $('.landlord-pic img').attr('src', '/static/media/'+data.detail.user_avatar)
        $('.landlord-name span').html(data.detail.user_name)
        $('.text-center li').html(data.detail.address)
        $('#house-num').html('出租'+data.detail.room_count+'间')
        $('#house-area').html('房屋面积:'+data.detail.acreage+'平米')
        $('#house-style').html('房屋户型:'+data.detail.unit)
        $('#house-people').html('宜住'+data.detail.capacity+'人')
        $('#house-bed').html('双人床'+data.detail.beds+'张')
        $('#house-bed').html('双人床'+data.detail.beds+'张')
        $('#house-depo').html(data.detail.deposit)
        $('#house-min').html(data.detail.min_days)
        $('#house-max').html(data.detail.max_days)

        var facil = ''
        for(var j=0;j<data.detail.facilities.length; j++){
            facilite = '<li><span class="'+data.detail.facilities[j].css+'"></span>'+data.detail.facilities[j].name+'</li>'
            facil += facilite
        }
        $('.clearfix').html(facil)
        //用于预定页面跳转
        $('.book-house').attr('href', '/order/booking/?house_id='+data.detail.id)

    })
})