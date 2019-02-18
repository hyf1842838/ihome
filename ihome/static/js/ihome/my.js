function logout() {
    $.get("/user/logout", function(data){
        if (0 == data.errno) {
            location.href = "/user/my_login/";
        }
    })
}

$(document).ready(function(){
    $.ajax({
        url:'/user/user_info/',
        dataType:'json',
        type:'GET',
        success:function (data) {
            $('#user-name').html(data.data.name)
            $('#user-mobile').html(data.data.phone)
            $('#user-avatar').attr('src', '/static/media/'+data.data.avatar)
        }
    })
})