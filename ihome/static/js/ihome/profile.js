function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$(document).ready(function () {
    $('#form-avatar').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/user/profile/',
            type:'PATCH',
            dataType:'json',
            success:function (data) {
                if(data.code == 200){
                    $('#user-avatar').attr('src', '/static/media/'+data.avatar)
                }
                if(data.code == 1009){
                    $('#avatar-err span').html(data.msg)
                    $('#avatar-err').show()
                }
            }
        })
    })

    $('#form-name').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/user/my_profile/',
            type:'POST',
            dataType:'json',
            success:function (data) {
                if(data.code == 200){
                    location.href = '/user/my/'
                }
                if(data.code == 1010){
                    $('#name-err span').html(data.msg)
                    $('#name-err').show()
                }
                if(data.code == 1011){
                    $('#name-err span').html(data.msg)
                    $('#name-err').show()
                }
            }
        })
    })

})

