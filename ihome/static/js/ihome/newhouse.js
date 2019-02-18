function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');


    $.get("/house/ne_house/", function (data) {
        if(data.code == 200){
            var distArray = data.data
            var areaNode = $('#area-id')
            for(var x in distArray){
                var dist = distArray[x]
                var distNode = $("<option value="+dist.id+">"+dist.name+"</option>")
                areaNode.append(distNode)
            }

            for(var y in data.facility){
                var facil = data.facility[y]
                var facilNode = $("<li><div class=\'checkbox\'><label><input type=\'checkbox\' " +
                    "name=\'facility\' value="+facil.id+">"+facil.name+"</label></div></li>")
                $('#house-facility').append(facilNode)
            }
        }
    })


    $('#form-house-info').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/house/newhouse/',
            type:'POST',
            dataType:'json',
            success:function (data) {
                if(data.code == 200){
                    $('#form-house-info').hide()
                    $('#house-id').attr('value', data.house_id)
                    $('#form-house-image').show()
                }
            }
        })
    })

    $('#form-house-image').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/house/image_house/',
            dataType:'json',
            type:'POST',
            success:function (data) {
                var imageArray = data.image
                //删除之前添加的图片
                $('.house-url').remove()
                for(var index in imageArray){
                    var imag = imageArray[index]
                    var imagNode = $("<img class=\"house-url\" style=\"width: 100px; height: 100px;\">").attr('src', '/static/media/'+imag.url)
                    $('.house-image-cons').append(imagNode)
                }
            }
        })

    })


})