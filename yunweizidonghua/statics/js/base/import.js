/**
 * Created by ServerSupporter-03 on 2018/7/11.
 */

$(function() {
    Upload_file();
});

function Upload_file(){
    $('.upload_file').click(function() {
        var file_obj = $('#id_upload_file')[0].files[0];
        var filename = $('#id_upload_file').attr('name');
        var form = new FormData();
        form.append(filename,file_obj);
        $.ajax({
            url:'/upload_file/' + filename,
            type:"post",
            dataType: 'json',
            data:form,
            processData: false,
            contentType: false,
            success:function(data){
                data.reponse_list.forEach(function(item){
                    var tagle = document.createElement('div');
                    tagle.innerText = item.message;
                    tagle.style.margin = '8px 2px';
                    if(item.status === false){
                        tagle.style.color = 'red'
                    }else{
                        tagle.style.color = '#00CD66'
                    }
                    $('.add_message').append(tagle);
                });
            }
        })

    })
}

