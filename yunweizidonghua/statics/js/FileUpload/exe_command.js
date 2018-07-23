/**
 * Created by ServerSupporter-03 on 2018/7/4.
 */
$(function(){
    tijiao_button();
    keyup_submit();
    select_host_user();
});

function exe_command_submit(){
    var command = $('#id_command').val();
        var current_ssh_time = $('#id_command').attr('current_time');
        var host = $('select[name="host"]').val();
        var host_user = $('select[name="host_user"]').val();
        var host_password = $('select[name="host_password"]').val();
        $.ajax({
            url:'/ssh_command',
            type : 'POST',
            data :{'host':host,'host_user':host_user,'host_password':host_password,
                'command':command,'current_ssh_time':current_ssh_time},
            success:function(data){
                if(data){
                    $('.command_data_return').empty();
                    var command_play = document.createElement('div');
                    command_play.style.whiteSpace = 'pre';
                    command_play.innerText = data;
                    $('.command_data_return').append(command_play);
                }
            }
        })
}
function tijiao_button() {
    $('.tijiao_command').click(function() {
        exe_command_submit()
    })
}

function keyup_submit() {
    $('#id_command').keypress(function(event){
        exe_command_submit()
    })
}

