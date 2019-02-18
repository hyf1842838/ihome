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




    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-comment").attr("order-id", orderId);
    });

    $.get("/order/my_order/", function (data) {
        if(data.code == 200){
            for(var i=0; i<data.orders.length;i++){
                var order = data.orders[i]
                var sta = order.status
                if(sta === 'WAIT_ACCEPT'){
                    status = '待接单'
                }else if(sta === 'WAIT_PAYMENT'){
                    status = '待支付'
                }else if(sta === 'PAID'){
                    status = '已支付'
                }else if(sta === 'WAIT_COMMENT'){
                    status = '待评价'
                }else if(sta === 'COMPLETE'){
                    status = '已完成'
                }else if(sta === 'CANCELED'){
                    status = '已取消'
                }else{
                    status = '已拒单'
                }
                var comments = order.comment?order.comment:'暂无评价'
                console.log(order)
                var orderNode = $('<ul class="orders-list">\n' +
                    '\n' +
                    '<li order-id="order.order_id">\n' +
                    '<div class="order-title">\n' +
                    '<h3>订单编号：'+order.order_id+'</h3>\n' +
                    '<div class="fr order-operate">\n' +
                    '<button type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal" onclick="commentOn();">发表评价</button>\n' +
                    '</div>\n' +
                    '\n' +
                    '</div>\n' +
                    '<div class="order-content">\n' +
                    '<img src="/static/media/'+order.image+'" style="height: 200px;">\n' +
                    '<div class="order-text">\n' +
                    '<h3>订单</h3>\n' +
                    '<ul>\n' +
                    '<li>创建时间：'+order.create_date+'</li>\n' +
                    '<li>入住日期：'+order.begin_date+'</li>\n' +
                    '<li>离开日期：'+order.end_date+'</li>\n' +
                    '<li>合计金额：'+order.amount+'元(共'+order.days+'晚)</li>\n' +
                    '<li>订单状态：\n' +
                    '<span>'+status+'</span>\n' +
                    '</li>\n' +
                    '<li>我的评价：'+comments+'</li>\n' +
                    '<li>拒单原因：</li>\n' +
                    '</ul>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</li>\n' +
                    '</ul>')
                $('.orders-con').append(orderNode)
            }

        }
    })



});