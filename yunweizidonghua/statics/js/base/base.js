/**
 * Created by ServerSupporter-03 on 2018/6/6.
 */
 
$(function () {
    memu_list_click();
    logout_display();
    select_host_user();
    input_radio_quxiao();
});

function memu_list_click() {
    $('.pg_body .pg_left .h3').click(function() {
        var has_memu_list = $(this).parent().parent().siblings();
        for(var i=0;i<has_memu_list.length;i++){

            if(has_memu_list.eq(i).children().last().hasClass('hider')){

            }else{
                if(has_memu_list.eq(i).children().last().hasClass('hoverli')){
                    has_memu_list.eq(i).children().last().addClass('hider');
                    has_memu_list.eq(i).children().first().removeClass('active')
                }else{
                    if(has_memu_list.eq(i).children().first().hasClass('active')){
                        has_memu_list.eq(i).children().first().removeClass('active')
                    }else{

                    }
                }
            }
            }
        if($(this).parent().hasClass('active')){

        }else{
            $(this).parent().addClass('active')
        }

        if($(this).parent().siblings().last().hasClass('hider')){
            $(this).parent().siblings().last().removeClass('hider');
        }else{
            $(this).parent().siblings().last().addClass('hider')
        }

    })
}
function logout_display() {
    $('.detail').click(function() {
        var has_hider = $('.pg_header .pg_top .logout').hasClass('hider');
        if (has_hider){
            $(this).addClass('active');
            $('.pg_header .pg_top .logout').removeClass('hider')
        }else{
            $('.pg_header .pg_top .logout').addClass('hider');
            $(this).removeClass('active')
        }

    })
}

function select_host_user() {
    $('select[name="host_user"]').change(function(){
        var username = $(this).children('option:selected').attr('class');
        // $('select[name="host_password"]').children().removeProp('selected');
        $('select[name="host_password"]').children('option[class=' + username +']').prop({'selected':'selected'});

    })
}

function input_radio_quxiao(){
            $('input:radio').click(function(){
                //alert(this.checked);
                //

                var domName = $(this).attr('name');

                var $radio = $(this);
                // if this was previously checked
                if ($radio.data('waschecked') == true){
                    $radio.prop('checked', false);
                    $("input:radio[name='" + domName + "']").data('waschecked',false);
                    //$radio.data('waschecked', false);
                } else {
                    $radio.prop('checked', true);
                    $("input:radio[name='" + domName + "']").data('waschecked',false);
                    $radio.data('waschecked', true);
                }
            });
        }