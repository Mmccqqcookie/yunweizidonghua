/**
 * Created by ServerSupporter-03 on 2018/6/12.
 */
$(function(){
    quanxuan();
});

function quanxuan() {
    $('.quanxuan').click(function() {
        var checked_val = $(this).prop('checked');
        if (checked_val){
            $("tbody tr td input[name='host_add']").prop({'checked':true});
        }else{
            $("tbody tr td input[name='host_add']").prop({'checked':false});
        }
    })
}