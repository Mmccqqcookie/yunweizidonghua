/**
 * Created by ServerSupporter-03 on 2018/7/17.
 */
$(function(){
  Upload_file();
});

function Upload_file(){
    $('.upload_file').click(function() {
        var file_obj = $('#id_upload_file')[0].files[0];
        var filename = $('#id_upload_file').attr('name');
        var host = $('select[name="host"]').val();
        var host_user = $('select[name="host_user"]').val();
        var host_password = $('select[name="host_password"]').val();
        var remotepath = $('input[id="id_upload_file_path"]').val();
        var exe_hosts = $('input:checked').val();
        var form = new FormData();
        form.append(filename, file_obj);
        form.append('host',host);
        form.append('host_user',host_user);
        form.append('host_password',host_password);
        form.append('exe_host',exe_hosts);
        form.append('remotepath',remotepath);
        $.ajax({
            url: '/upload_file/' + filename,
            type: "post",
            dataType: 'json',
            data: form,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                if(data.status){
                    alert(data.message)
                }

            }
        })
    })
};