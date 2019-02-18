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

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });

    $.get("/order/lorders_order/", function (data) {
        if(data.code == 200){
            for(var i=data.orders.length-1;i>=0;i--){
                var orderHouse=data.orders[i]
                for(var j=orderHouse.length-1;j>=0;j--){
                    var houseOrder = orderHouse[j]
                    var orderNode=$('<ul class="orders-list">\n' +
                    '<li order-id=>\n' +
                    '<div class="order-title">\n' +
                    '<h3>订单编号：123</h3>\n' +
                    '<div class="fr order-operate">\n' +
                    '<button type="b    utton" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>\n' +
                    '<button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '<div class="order-content">\n' +
                    '<img src="">\n' +
                    '<div class="order-text">\n' +
                    '<h3>房屋标题</h3>\n' +
                    '<ul>\n' +
                    '<li>创建时间：2016-11-11</li>\n' +
                    '<li>入住日期：2016-11-11</li>\n' +
                    '<li>离开日期：2016-11-11</li>\n' +
                    '<li>合计金额：￥1000(共1晚)</li>\n' +
                    '<li>订单状态：\n' +
                    '<span>待接单</span>\n' +
                    '</li>\n' +
                    '<li>客户评价： 挺好的</li>\n' +
                    '</ul>\n' +
                    '</div> \n' +
                    '</div>\n' +
                    '</li>\n' +
                    '</ul>')
                }

            }

        }
    })


});