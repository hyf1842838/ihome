function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function() {
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#password").focus(function(){
        $("#password-err").hide();
    });
    $(".form-login").submit(function(e){
        e.preventDefault();
        mobile = $("#mobile").val();
        passwd = $("#password").val();
        if (!mobile) {
            $("#mobile-err span").html("请填写正确的手机号！");
            $("#mobile-err").show();
            return;
        } 
        if (!passwd) {
            $("#password-err span").html("请填写密码!");
            $("#password-err").show();
            return;
        }
        $.ajax({
            url:'/user/my_login/',
            type:'POST',
            dataType:'json',
            data:{'mobile': mobile, 'passwd': passwd},
            success:function (data) {
                if(data.code == '200'){
                    location.href = '/user/my/'
                    // $(location).attr('href', '/user/my/')
                }
                if(data.code == '1007'){
                    $('#mobile-err span').html(data.msg)
                    $('#mobile-err').show()
                }
            },
            error:function (data) {
                alert('error')
            }
        })
    });
})