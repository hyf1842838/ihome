function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24) + 1;
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });

    // 利用已有的商品详情接口渲染预定页面的数据
    var search = location.search
    var id = search.split('=')[1]
    $.get("/house/detail/" + id + "/", function (data) {
        $('.house-text h3').html(data.detail.title)
        $('.house-text span').html(data.detail.price)
        $('.house-info img').attr('src', '/static/media/'+data.detail.images[0])
    })

    //提交数据
    $('.submit-btn').click(function () {
        var data = {'house_id': id,'start_time':$('#start-date').val(), 'end_time':$('#end-date').val()}
        $.post('/order/book_time/', data, function (data) {
            if(data.code == 200){
                location.href = '/order/orders/'
            }
            else if(data.code == 2750){
                console.log(data.msg)
            }
        });
    });
})