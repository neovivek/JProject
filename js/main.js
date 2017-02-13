$(document).ready(function(){
    $("body").animate({scrollTop: 0}, "slow");
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
    $('#recover-container').on('shown.bs.modal', function () {
        $('#recover').focus()
    });
    
	$('#carousel-generic').width($(window).width());
	$('#carousel-generic').height($(window).height());
	$('.image').width($(window).width());
    $('.image').height($(window).height());
    $('#signup').click(function(){
        window.location = '/signupengine.php';
    });
    $('#recover-active').click(function(){
        var to = $('#recover').val();
        if(to.length > 9){
            if(to.indexOf('@')!==-1)    
            {    if((to.split('@')[1]).split('.')[1] === 'com' && (to.split('@')[0]).length > 2 && (to.split('@')[1]).length > 8){
                    Motion.downloadUrl('/php/recovery.php?to='+to,function(data){
                        $('#recover').parent().find('.glyphicon').remove();
                        $('#recover-container').find('.alert').remove();
                        if(data.responseText === 'success'){
                            $('#recover-container').find('.modal-header').append("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>hurray!</strong> We have send you your new password at your mail.</div>");
                        }else{
                            $('#recover-container').find('.modal-header').append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap!</strong> Please check your Email Id or try after some time.</div>");
                        }
                    });
                }else{
                    $('#recover-container').find('.alert').remove();
                    $('#recover').parent().find('.glyphicon').remove();
                    $('#recover').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
                    $('#recover').css("border", "1px solid red");
                }
            }else{
                $('#recover-container').find('.alert').remove();
                $('#recover').parent().find('.glyphicon').remove();
                $('#recover').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
                $('#recover').css("border", "1px solid red");
            }
        }else{
            $('#recover-container').find('.alert').remove();
            $('#recover').parent().find('.glyphicon').remove();
            $('#recover').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            $('#recover').css("border", "1px solid red");
        }
    });
    if($(window).width() < "764"){
        $("#login").addClass("btn-block");
    }else{
        $("#login").removeClass("btn-block");
    }
    if($(window).width() > "898"){
        ratio = (parseFloat($("body").scrollTop()) / 351.0);
        ratio = (ratio > 1)? 1: ratio;
        opacity = ratio + 0.3;
        $(".navbar-collapse.collapse")
        .css("zoom", 1.2 - parseFloat(ratio * 0.2))
        .css("padding", (16 - ratio*16)+ "px 0");
    }else{
        ratio = 1;
        opacity = ratio + 0.3;
    }
    $(".navbar-inverse")
    .css("background-image", "-webkit-linear-gradient(top,rgba(0, 0, 0, "+opacity+") 0,rgba(0, 0, 0, "+opacity+") 100%)")
    .css("background-image", "-o-linear-gradient(top,rgba(0, 0, 0, "+opacity+") 0,rgba(0, 0, 0, "+opacity+") 100%)")
    .css("background-image", "-webkit-gradient(linear,left top,left bottom,from(rgba(0, 0, 0, "+opacity+")),to(rgba(0, 0, 0, "+opacity+")))")
    .css("background-image", "linear-gradient(to bottom, rgba(0, 0, 0, "+opacity+") 0%, rgba(0, 0, 0, "+opacity+") 100%)")
    .height(101 - parseFloat(ratio*50));

    $('#logo').css("width", 70 - parseFloat(ratio*23) + "px");

    $(".header-left.clearfix")
    .css("padding", (16 - ratio*14)+ "px 0px " + (16 - ratio*14)+ "px 12px");

    $('.site-name').css("font-size", 22 - ratio*4 + "px");
    $('.site-slogan').css("font-size", 15 - ratio*4 + "px");
});

$(window).scroll(function(){
    if($(window).width() > "898"){
        ratio = (parseFloat($("body").scrollTop()) / 351.0);
        ratio = (ratio > 1)? 1: ratio;
        opacity = ratio + 0.3;
        $(".navbar-inverse")
        .css("background-image", "-webkit-linear-gradient(top,rgba(0, 0, 0, "+opacity+") 0,rgba(0, 0, 0, "+opacity+") 100%)")
        .css("background-image", "-o-linear-gradient(top,rgba(0, 0, 0, "+opacity+") 0,rgba(0, 0, 0, "+opacity+") 100%)")
        .css("background-image", "-webkit-gradient(linear,left top,left bottom,from(rgba(0, 0, 0, "+opacity+")),to(rgba(0, 0, 0, "+opacity+")))")
        .css("background-image", "linear-gradient(to bottom, rgba(0, 0, 0, "+opacity+") 0%, rgba(0, 0, 0, "+opacity+") 100%)")
        .height(101 - parseFloat(ratio*50));

        $(".navbar-collapse.collapse")
        .css("zoom", 1.2 - parseFloat(ratio * 0.2))
        .css("padding", (16 - ratio*16)+ "px 0");

        $('#logo').css("width", 70 - parseFloat(ratio*23) + "px");

        $(".header-left.clearfix")
        .css("padding", (16 - ratio*14)+ "px 0px " + (16 - ratio*14)+ "px 12px");

        $('.site-name').css("font-size", 22 - ratio*4 + "px");
        $('.site-slogan').css("font-size", 15 - ratio*4 + "px");
    }
});

$(window).resize(function(){
	$('#carousel-generic').width($(window).width());
    $('.signup-form-background').width($(window).width());
    $('.image').width($(window).width());
    if($(window).width() < "764"){
        $("#login").addClass("btn-block");
    }else{
        $("#login").removeClass("btn-block");
    }
    // $("#banner").css("min-height", $(window).height() + "px");
});

var Motion = {

    downloadUrl: function(url, callbacks) {
      var request1 = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;

      request1.onreadystatechange = function() {
        if (request1.readyState == 4) {
          request1.onreadystatechange = Motion.doNothing;
          callbacks(request1);
        }
      };

      request1.open('GET', url, true);
      request1.send(null);
    },

    doNothing: function(){}
}


function validate(){

    if($("#about").val().length < 15){
        $('#about').parent().find('.glyphicon').remove();
        $('#about').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
         return;
    }else{
        about = true;
        $('#about').parent().find('.glyphicon').remove();
        $('#about').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
    }
}