function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function () {
    $('#form-auth').submit(function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/user/auth/',
            dataType:'json',
            type:'POST',
            success:function (data) {
                if(data.code == 200){
                   location.href = '/user/my/'
               }
               if(data.code == 2000){
                   $('.error-msg span').html(data.msg)
                   $('.error-msg').show()
               }
               if(data.code == 2001){
                   $('.error-msg span').html(data.msg)
                   $('.error-msg').show()
               }
               if(data.code == 2002){
                   $('.error-msg span').html(data.msg)
                   $('.error-msg').show()
               }
               if(data.code == 2003){
                   $('.error-msg span').html(data.msg)
                   $('.error-msg').show()
               }
            }
        })
    })

    $.ajax({
        url: '/user/my_auth/',
        dataType: 'json',
        type: 'GET',
        success:function (data) {
            if(data.code == 200){
                $('#real-name').attr('value', data.data.id_name)
                $('#real-name').attr('disabled', 'disabled')
                $('#id-card').attr('value', data.data.id_card)
                $('#id-card').attr('disabled', 'disabled')
                $('#save-btn').hide()
            }
        }
    })
})

