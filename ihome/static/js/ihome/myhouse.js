$(document).ready(function(){
    $(".auth-warn").show();
    $.get("/house/myhouse/", function (data) {
        if(data.code == 200){
            $('#no-put-house').hide()
        } else {
            $('#houses-list').hide()
        }
    })

    $.get("/house/house_info/", function (data) {
        if(data.code == 200){
            for(var index in data.houses){
                var house = data.houses[index]
                var houseNode = $("<li>\n" +
                    "<a href=\"/house/detail/?house_id="+house.id+"\">\n" +
                    "<div class=\"house-title\">\n" +
                    "<h3>房屋ID:"+ house.id +"—— 房屋标题:"+ house.title +"</h3>\n" +
                    "</div>\n" +
                    "<div class=\"house-content\">\n" +
                    "<img src=\"/static/media/"+ house.image +"\">\n" +
                    "<div class=\"house-text\">\n" +
                    "<ul>\n" +
                    "<li>位于："+ house.area +"</li>\n" +
                    "<li>价格：￥"+ house.price +"/晚</li>\n" +
                    "<li>发布时间："+ house.create_time +"</li>\n" +
                    "</ul>\n" +
                    "</div> \n" +
                    "</div>\n" +
                    "</a>\n" +
                    "</li>")
                $('#houses-list').append(houseNode)
            }
        }
    })



})