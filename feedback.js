$(document).ready(function(){
    $('#show_tool_rating').click(function(){
        $("#feeback-icon").trigger('click');
    });
    setTimeout(function(){
        $.ajax({
            type:'get',
            contentType:false,
            cache:false,
            processData:false,
            url:base_url+'get-tool-rating/'+$("#tool").val()+'/',
            success:function(response) {
                if(response.status == 'success'){
                    updateStarRating(response);
                }
            },
            error:function(response){
                $("#tool_review_loader").hide();
            }
        });
    },1500)
})
function updateStarRating(response) {
    var round_rating = response.tool_rating;
    if (round_rating != 0) {
        $(".avg_rating_score").text(response.tool_rating.toFixed(1));
        $(".tool_total_reviews").text(response.total_reviews);
        var total_rating=Math.round(round_rating);
        $('#rating_stars_widget .rating_icon').each(function(k,v){
            if(k >= total_rating){
                return false;
            }
            $(this).addClass('hover_on');
        })
    }
    $("#tool_review_loader").hide();
    $("#show_tool_rating").fadeIn(500);
}
function feedback_hover_add() {
    $("[data-active]").addClass("active");
    $("[data-counter]").removeClass("hover_on");
    $(".rating_icon[data-counter]").each(function () {
        var counter_v = $(this).data("counter");
        $('.rating_icon[data-counter="' + counter_v + '"]').addClass("hover_on");
        if ($(this).hasClass("active")) {
            $('.user_feedback[data-counter="' + counter_v + '"]').addClass("hover_on");
            return false;
        }
    });
}
$("[data-counter]").hover(
    function () {
        $("[data-counter]").removeClass("active");
        var counter_v = $(this).data("counter");
        $("[data-counter]").removeClass("hover_on");
        $(".rating_icon[data-counter]").each(function () {
            var counter_v2 = $(this).data("counter");
            $('.rating_icon[data-counter="' + counter_v2 + '"]').addClass("hover_on");
            if (counter_v == counter_v2) {
                $('.user_feedback[data-counter="' + counter_v2 + '"]').addClass("hover_on");
                return false;
            }
        });
    },
    function () {
        feedback_hover_add();
    }
);
feedback_hover_add();

$("#feedback_screenShoot").on('change',function(e) {
    screen_shoot = $("#feedback_screenShoot")[0].files[0];
    screen_shoot_name = screen_shoot.name;
    $("#validation_errors").addClass('d-none');
    if(screen_shoot.size > 1024*1024*10){
        var error = 'Max Allowed File Size Is 10MB'
        showValidateionErrors(error);
        $("#feedback_ss_name").text('Upload Screeshot')
        $("#feedback_screenShoot").val('');
        return false;
    }
    f_extension = screen_shoot_name.substring(screen_shoot_name.lastIndexOf('.') + 1);
    validExtensions = ['jpg','png','jpeg'];
    if ($.inArray(f_extension, validExtensions) != -1) {
        if(screen_shoot_name.length > 25){
            screen_shoot_name = screen_shoot_name.substring(0,25)+"."+f_extension;
        }
        $("#feedback_ss_name").text(screen_shoot_name)
    }else{
        var error = 'Only PNG And JPG Images are allowed!'
        showValidateionErrors(error);
        $("#feedback_ss_name").text('Upload Screeshot')
        $("#feedback_screenShoot").val('');
        return false;
    }
});
$('#feedback_form').on('submit',(event)=>{
    event.preventDefault();
    if(validateBeforeSubmission()){ // form validated 
        $("#feedback_success").addClass('d-none');
        var formData = new FormData($('#feedback_form')[0]);
        $("#btn_sendFeedback").html('<span style="height:1.5rem;width:1.5rem"  class="spinner-border text-white"></span>')
        $("#btn_sendFeedback").prop('disabled', true);
        $.ajax({
            type:'post',
            data:formData,
            contentType:false,
            cache:false,
            processData:false,
            url:base_url+'send-feedback/',
            success:function(response) {
                if(response.status == 'success'){
                    $("#feedback_success").html('<i class="bi bi-check-circle-fill text-success"></i> '+response.message)
                    $("#feedback_success").removeClass('d-none')
                    $("#feedback_success").show();
                    clearFeedBackForm();
                }
                else if(response.status == 'error'){
                    let errors = '<ul>';
                    $.each(response.errors, function(key,error) {
                        errors += '<li>'+error+'</li>'
                    });
                    errors +='</ul>';
                    $("#validation_errors").removeClass('d-none');
                    $("#validation_errors").html(errors);
                    $("#btn_sendFeedback").html('Send Feedback');
                    $("#btn_sendFeedback").prop('disabled', false);
                    resetReacaptcha();
                    scrollModalUp()
                } 
            },
            error:function(error){
                setTimeout(function(){
                    $("#btn_sendFeedback").html('Send Feedback');
                    $("#btn_sendFeedback").prop('disabled', false);
                },1000)
            }
        });
    }
    
});
function showValidateionErrors(error){
    error = '<li>'+error+'</li>'
    $("#validation_errors").html(error);
    $("#validation_errors").removeClass('d-none');
    $("#btn_sendFeedback").prop('disabled', false);
    scrollModalUp();
    resetReacaptcha();
    return false;
}
function saveToolRating(token){
    var formData = new FormData($('#toolRating_form')[0]);
    $("#toolRating_form").hide();
    $("#tool_rating_save_loader").show();
    $.ajax({
        type:'post',
        data:formData,
        contentType:false,
        cache:false,
        processData:false,
        url:base_url+'save-rating/',
        success:function(response) {
            if(response.status == 'success'){
                $("#tool_rating_save_loader").fadeOut('slow');
                $("#feedback_success").html(response.message);
                setTimeout(function(){
                    $("#feedback_success").removeClass('d-none').fadeIn('slow')
                },300)
                var currentTool = window.location.pathname;
                setCookie("ToolRating",'saved',1440,currentTool)
                // setCookie("ToolRating",'saved',1440)
            }
            else if(response.status == 'error'){
                let errors = '<ul>';
                $.each(response.errors, function(key,error) {
                    errors += '<li>'+error+'</li>'
                });
                errors +='</ul>';
                $("#validation_errors").removeClass('d-none');
                $("#validation_errors").html(errors);
                $("#btn_sendFeedback").html('Send Feedback');
                $("#btn_sendFeedback").prop('disabled', false);
                $("#toolRating_form").show();
                resetReacaptcha();
                scrollModalUp()
            } 
        },
        error:function(error){
            setTimeout(function(){
                $("#btn_sendFeedback").html('Send Feedback');
                $("#btn_sendFeedback").prop('disabled', false);
            },1000)
        }
    });
}
function scrollModalUp(){
    $('#feedbackModal').animate({ scrollTop: 0 }, 'slow');
}
function resetReacaptcha(){
    $(".g-recaptcha").each(function (k,v) {
        grecaptcha.reset(k);
    });
}
function clearFeedBackForm(){
    show_messages('success','Thank You! Your feedback has been sent successfully.')
    $("#btn_sendFeedback").html('<img src="https://smallseotools.com/webimages/success_msg.svg" alt="" class="img-fluid mx-2" style="width:20px"> Feedback Sent');
    $("#feedback_success").delay(1000).fadeOut('slow');
    $('#feedback_form')[0].reset();
    $('#feedbackModal').delay(1600).fadeOut('slow');
    $("#feedbackModal").modal('hide');
    $("#btn_sendFeedback").html('Send Feedback');
    $("#btn_sendFeedback").prop('disabled', false);
    $("#feedback_ss_name").text('Upload Screeshot')
    resetReacaptcha();
    wordCounter();
}
$("[data-counter]").click(function(){
    $("#feedback_emotion").val($(this).data('emotion'))
    $("#star_rating").val($(this).data('counter'))
    $('#feedback_recaptcha_rating').trigger('click');
});
function dataCallbackgRecapchaRating(){
    saveToolRating();
}
function validateBeforeSubmission(){
    $("#validation_errors").addClass('d-none');
    var text_val=$('#feedback_message').val().trim();
    if(text_val == ''){
        var error = 'Please write message before you submit feedback.'
        showValidateionErrors(error);
        return false;
    }else{
        var check_count=$('#feedback_message').val().trim();
        var check_count = check_count.replace(/\s+/gi, ' ').split(' ').length;
        if(check_count == 0){
            var error = 'Please write message before you submit feedback.'
            showValidateionErrors(error);
            return false
        }else if(check_count > 300){
            var error = 'You can submit message of upto 300 Words maximum!'
            showValidateionErrors(error);
            return false
        }
    }
    return true;
}
function wordCounter(){
    setTimeout(function(){ 
        var val = $('#feedback_message').val().trim();
        chars = val.length;
        if(!chars){
            words=0;
        }else{
            words = val.replace(/\s+/gi, ' ').split(' ').length;
        }
        $("#count_words").html(words);
    },500);
}

$('#feedbackModal').on('shown.bs.modal', function (e) {
    $("#feeback-icon").hide(); //hide feedback button once modal is open
});
$('#feedbackModal').on('hidden.bs.modal', function (e) {
    $("#feeback-icon").show();
});
