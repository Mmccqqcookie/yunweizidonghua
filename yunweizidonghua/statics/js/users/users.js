/**
 * Created by ServerSupporter-03 on 2018/6/12.
 */
$(function(){
    quanxuan();
    // del_User_host();
});

function quanxuan() {
    $('.quanxuan').click(function() {
        var checked_val = $(this).prop('checked');
        if (checked_val){
            $("tbody tr td input[name='user_add']").prop({'checked':true});
        }else{
            $("tbody tr td input[name='user_add']").prop({'checked':false});
        }
    })
}

// function del_User_host() {
//     $('.del').click(function() {
//         var date_id = $(this).attr('del_id');
//
//         $.ajax({
//             url : '/del/user/' + date_id,
//             type : 'POST',
//             success:function(data){
//                 if(data){
//                     location.reload()
//                 }
//             }
//
//             })
//     })
// }