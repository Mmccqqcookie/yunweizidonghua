/**
 * Created by ServerSupporter-03 on 2018/6/21.
 */

$(function () {
    validation_email_username();
    validation_password();
    validation_submit();
});
function email_username(thiss) {
        $(thiss).parent().find('span').remove();
        var input_val = $(thiss).val();
        if(input_val.trim().length===0){
            var create_span = document.createElement('span');
            create_span.innerText = '不允许为空';
            create_span.style.color = 'red';
            $(thiss).parent().append(create_span);
            return false
        }else{
            var email_user = /@/;
            if(input_val.search(email_user) === -1){
                return true
            }else{
                 var reg = /^\w+@\w+\.(com|cn|gov)$/;
                 if(reg.test(input_val)===true){
                    return true
                }else{

                    var create_span = document.createElement('span');
                    create_span.innerText = 'email不符合规范';
                    create_span.style.color = 'red';
                    $(thiss).parent().append(create_span);
                    return false
                }
            }

        }
}
function validation_email_username() {
    $("input[id='inputEmail3']").focusin(function(){
       $(this).parent().find('span').remove();
    });
    $("input[id='inputEmail3']").focusout(function(){
        var thiss = this;
        email_username(thiss);
    })
}
function password_v(thiss) {
    $(thiss).parent().find('span').remove();
    var input_val = $(thiss).val();
        if (input_val.trim().length ===0){
            var create_span = document.createElement('span');
            create_span.innerText = '不允许为空';
            create_span.style.color = 'red';
            $(thiss).parent().append(create_span);
            return false
        }else{
            var password_reg = /^\w{6,16}$/;
            if(password_reg.test(input_val)===true){
                return true
            }else{
                var create_span = document.createElement('span');
                create_span.innerText = '密码最低6位，不超过16位';
                create_span.style.color = 'red';
                $(thiss).parent().append(create_span);
                return false
            }
        }
}
function validation_password() {
    $("input[id='inputPassword3']").focusin(function() {
        $(this).parent().find('span').remove();
    });
    $("input[id='inputPassword3']").focusout(function () {
        var thiss = this;
        password_v(thiss);
    })
}

function validation_submit() {
    $('.tijiao').click(function(){
        $('form').bind('submit',function(){
            var thiss = $('#inputEmail3');
            reslut = email_username(thiss);
            if (reslut===true){

            }else{
                return false
            }
            thiss = $('#inputPassword3');
            reslutt = password_v(thiss);
            if (reslutt===true){

            }else{
                return false
            }
        })
    })
}


