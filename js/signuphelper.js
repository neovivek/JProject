$(document).ready(function(){
    $("body").animate({scrollTop: 0}, "slow");
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
    $('#logout').click(function(){
        setTimeout(function(){
            window.location = '/php/error.php';
        },1200);
    });
    $('#imagefile').change(function(){
        if($(this).val()){
            $("#imageAjaxSubmit").click();
        }
        else
            $("#forward").attr('disabled', 'true');
    });
    $("#imageUploadForm").on('submit',function(e){
        e.preventDefault();
        $(".image-handler img").attr('src', '/images/JProjectwaiting.gif').css('height', '60px').css('width', 'auto').css('margin-top','70px').css('margin-left', '50px');
        $.ajax({
            url: "/php/upload.php",
            type: "POST",
            data: new FormData(this),
            dataType: "xml",
            contentType: false,
            cache: false,
            processData:false,
            success: function(data){
                $(".image-handler img").removeAttr("src").css('height', 'auto');
                var users = data.documentElement.getElementsByTagName('user');
                var error = data.documentElement.getElementsByTagName('error');
                if(users.length > 0){
                    $("#forward").removeAttr('disabled');
                    $('.container.main .col-sm-4:last').find('.alert').remove();
                    $('.container.main .col-sm-4:last').append("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Profile picture updated!</strong></div>");
                    var address = users[0].getAttribute('image');
                    var width = users[0].getAttribute('width');
                    var height = users[0].getAttribute('height');
                    $('#ImageFileName').val(address);
                    if(parseInt(width) < parseInt(height)){
                        heightNew = height * 210 / width;
                        heightOffset = (210 - heightNew) / 2;
                        $(".inner-image-box img").css('width', '105%').css('margin-top', heightOffset).css('height', 'auto').css('margin-left', '-5px');
                    }else{
                        widthNew = width * 210 / height;
                        widthOffset = (210 - widthNew) / 2;
                        $(".inner-image-box img").css('height', '105%').css('margin-left', widthOffset).css('width', 'auto').css('margin-top', '-5px');
                    }
                    setTimeout(function(){
                        $(".image-handler img").attr('src', address);
                    },200);
                }else if(error.length > 0){
                    $("#forward").attr('disabled', true);
                    $('#ImageFileName').val('');
                    var message = error[0].getAttribute('content');
                    $('.container.main .col-sm-4:last').find('.alert').remove();
                    $('.container.main .col-sm-4:last').append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oops!</strong>"+ message +"</div>");
                }
            }
        });
    });

    var timeout = 1e3; // 1 second default timeout
    var timeoutReference;

    $("#username").keyup(function(e){
        e.preventDefault();
        $('#username').parent().find('.glyphicon').remove();
        clearTimeout(timeoutReference);
        if(e.keyCode == 16 || e.keyCode == 9) return;
        if($(this).val()){
            timeoutReference = setTimeout(function(){
                doneTyping();
            }, timeout);
        }else{
            Motion.printmessage("", ".main");
        }
    });

});

function doneTyping(){
    var username = false;
    e = $('#username').val();
    var arr1 = " ~`@!#$%^&*+=[]\\\';,/{}|\":<>?";
    if(e.length > 2){
        for(i=0; i<e.length; i++){
            if(arr1.indexOf(e.charAt(i)) !== -1){break;}
        }
        if(i=== e.length){
            username = true;
            $('#username').parent().find('.glyphicon').remove();
        }else{
            $('#username').parent().find('.glyphicon').remove();
            $('#username').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage("Your username can't have special characters.", ".main");
        }
    }else{
        $('#username').parent().find('.glyphicon').remove();
        $('#username').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage("Your username should be atleast 3 characters long.", ".main");
    }
    if(username == true){
        $.ajax({
            url: '/php/usernameverify.php',
            type: "POST",
            data: { "username": e },
            success: function(data){
                if(data.documentElement.getElementsByTagName('error').length > 0){
                    $('#username').parent().find('.glyphicon').remove();
                    $('#username').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
                    Motion.printmessage("Username has already been used.", ".main");
                }else if(data.documentElement.getElementsByTagName('success').length > 0){
                    $('#username').parent().find('.glyphicon').remove();
                    $('#username').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
                    Motion.printmessage("", ".main");
                }
            }
        });
    }
}

function validate(){
    // var BOSH_SERVICE = 'http://jproject.in:7070/http-bind/';
    var BOSH_SERVICE = 'http://localhost:7070/http-bind/';
    var name = false;
    var number = false;
    var pass = false;
    var username = false;
    var i;

    a = $('#name').val();
    var arr = "~`@!#$%^&*+=-[]\\\';,/{}|\":<>?0123456789";
    if(a.length > 2){
        for(i=0; i<a.length; i++){
            if(arr.indexOf(a.charAt(i)) !== -1){break;}
        }
        if(i === a.length){
            name = true;
            $('#name').parent().find('.glyphicon').remove();
            $('#name').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
        }else{
            $('#name').parent().find('.glyphicon').remove();
            $('#name').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage("Your name can't have special characters or numbers.", ".main", ".main"); return;
        }
    }else{
        $('#name').parent().find('.glyphicon').remove();
        $('#name').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage("Your name should have atleast 3 charachters.", ".main"); return;
    }

    b = $('#email').val();
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!filter.test(b)){
        $('#email').parent().find('.glyphicon').remove();
        $('#email').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage("Your email soes not match a valid email string.", ".main"); return;
    }else{
        email = true;
        $('#email').parent().find('.glyphicon').remove();
        $('#email').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
    }

    h = $('#number').val();
    var arr3 = "0123456789";
    if(h.length===10 && h[0] != 0){
        for(i=0; i<h.length; i++){
            if(arr3.indexOf(h.charAt(i)) === -1){break;}
        }
        if(i === h.length){
            number = true;
            $('#number').parent().find('.glyphicon').remove();
            $('#number').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
        }else{
            $('#number').parent().find('.glyphicon').remove();
            $('#number').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage("Your mobile number should have only numbers.", ".main"); return;
        }
    }else{
        $('#number').parent().find('.glyphicon').remove();
        $('#number').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage("Your mobile should be of exactly 10 digits and should not start with 0.", ".main"); return;
    }

    c = $('#pass').val();
    d = $('#pass1').val();
    if(c.length < 6){
        Motion.printmessage("Password should be atleast 6 characters long.", ".main"); return;
    }
    if(c===d && c.length>5){
        pass = true;
        $('#pass1').parent().find('.glyphicon').remove();
        $('#pass1').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
    }else{
        $('#pass1').parent().find('.glyphicon').remove();
        $('#pass1').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage("Password does not match. Please check again. ", ".main"); return;
    }

    e = $('#username').val();
    var arr1 = " ~`@!#$%^&*+=[]\\\';,/{}|\":<>?";
    if(e.length > 2){
        for(i=0; i<e.length; i++){
            if(arr1.indexOf(e.charAt(i)) !== -1){break;}
        }
        if(i=== e.length){
            username = true;
            $('#username').parent().find('.glyphicon').remove();
            $('#username').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
        }else{
            $('#username').parent().find('.glyphicon').remove();
            $('#username').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage("Your username can't have special characters.", ".main"); return;
        }
    }else{
        $('#username').parent().find('.glyphicon').remove();
        $('#username').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage("Your username should be atleast 3 characters long.", ".main"); return;
    }

    if(name===true && number===true && pass===true && username===true && email==true){
        
        var payload = {"name":a ,"email":b, "number":h, "pass":c, "username":e, "captcha_code":$('#captcha_code').val(), "t":"1"};
        console.log(payload);
        $.ajax({
            url: '/php/signup.php',
            data: payload,
            type: "POST",
            success: function(data){
                console.log(data);
                if(data.documentElement.getElementsByTagName('user').length > 0){
                    var connection = new Strophe.Connection(BOSH_SERVICE);
                    var user = data.documentElement.getElementsByTagName("user");
                    var z = user[0].getAttribute("id");
                    connection.register.connect("hp", function (status) {
                        if (status === Strophe.Status.REGISTER) {
                            connection.register.fields.username = z;
                            connection.register.fields.password = c;
                            connection.register.fields.email = b;
                            connection.register.fields.name = e;
                            connection.register.submit();
                        } else if (status === Strophe.Status.REGISTERED) {
                            connection.authenticate();
                        } else if (status === Strophe.Status.CONFLICT) {
                        } else if (status === Strophe.Status.NOTACCEPTABLE) {
                        } else if (status === Strophe.Status.REGIFAIL) {
                            $.ajax({
                                url: '/php/rollbacksignup.php',
                                data: payload,
                                type: "GET"
                            });
                        } else if (status === Strophe.Status.CONNECTED) {
                        }
                    });
                    Motion.refreshCaptcha();
                    $('#captcha_code').val('');
                    $('#name').val('');
                    $('#email').val('');
                    $('#number').val('');
                    $('#pass').val('');
                    $('#pass1').val('');
                    $('#username').val('');
                    $('.form-signin').find('.glyphicon').remove();
                    setTimeout(function(){
                        $('.container.main').html("<form action='javascript: validateMobile();' class='form-signin'><h3>Let us know a little more about you</h3><div class='form-group has-feedback'> <input type='text' class='form-control' id='city' placeholder='Current City' data-toggle='tooltip' data-placement='bottom' title='This will help you find people who belong to same city when you are out of town.' /></div> <div class='form-group has-feedback'> <select type='text' class='form-control' id='gender' placeholder='Select your Gender' > <option value='0' selected='selected' disabled='disabled'>Select your Gender</option> <option value='1'>Male</option> <option value='2'>Female</option> </select></div> <button class='btn btn-lg btn-danger btn-block' type='submit'>Continue</button> </form>");
                    }, 800);
                    if($(document).height() == $(window).height()){
                      $('footer').css('bottom', '0px').css('position', 'absolute').css('width', '100%');
                    }else{
                      $('footer').css('bottom', 'auto').css('position', 'relative').css('width', '100%');
                    }
                }else if(data.documentElement.getElementsByTagName('error').length > 0){
                    $(window).scrollTop(0);
                    $('.main').find('.alert').remove();
                    $('.main').prepend("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap!</strong>"+ data.documentElement.getElementsByTagName('error').getAttribute('content') +"</div>");
                    Motion.refreshCaptcha();
                    $('#captcha_code').val('');
                }
            }
        });
    }
}

function validateMobile(){
    f = $('#city').val();
    var arr2 = "~`@!#$%^&*+=[]\\\';,-/{}|\":<>?";
    if(f.length > 2){
        for(i=0; i<f.length; i++){
            if(arr2.indexOf(f.charAt(i)) !== -1){break;}
        }
        if(i=== f.length){
            city = true;
            $('#city').parent().find('.glyphicon').remove();
            $('#city').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
        }else{
            $('#city').parent().find('.glyphicon').remove();
            $('#city').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage("City name should be english and can't have special characters.", ".main"); return;
        }
    }else{
        $('#city').parent().find('.glyphicon').remove();
        $('#city').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage("City name should be atleast 3 characters long.", ".main"); return;
    }

    g = $('#gender option:selected').attr('value');
    if(g > 0){
        gender = true;
        $('#gender').parent().find('.glyphicon').remove();
        $('#gender').parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
    }else{
        $('#gender').parent().find('.glyphicon').remove();
        $('#gender').parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
        Motion.printmessage('You have to select your gender.', ".main"); return;
    }

    var payloadnew = "city="+f+"&gender="+g+"&t=2";
    $.ajax({
        url: "/php/signup.php",
        data: payloadnew,
        type: "GET", 
        success: function(data){
            if(data.documentElement.getElementsByTagName('user').length > 0){
                setTimeout(function(){
                    window.location = '/signupengine.php';
                },500);
            }else if(data.documentElement.getElementsByTagName('error').length > 0){
                if(data.documentElement.getElementsByTagName('error').getAttribute('content') == "User Invalid"){
                    window.location = '/signupengine.php';
                }
                $(window).scrollTop(0);
                $('.container:first').find('.alert').remove();
                $('.container:first').prepend("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap! </strong>"+ data.documentElement.getElementsByTagName('error').getAttribute('content') +"</div>");
            }
        }
    });
}

function insert(type){
    if(type == 1){
        $.ajax({
            url: '/php/signup.php?t=3',
            success: function(data){
                if(data.documentElement.getElementsByTagName('user').length > 0){
                    setTimeout(function(){
                        window.location = '/signupengine.php';
                    },500);
                }else if(data.documentElement.getElementsByTagName('error').length > 0){
                    $('.container.main .col-sm-4:last').find('.alert').remove();
                    $('.container.main .col-sm-4:last').append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap! </strong>"+ data.documentElement.getElementsByTagName('error').getAttribute('content') +"</div>");
                }
            }
        });
    }else if(type == 2){
        $.ajax({
            url: '/php/signup.php?t=5&s=',
            success: function(data){
                if(data.documentElement.getElementsByTagName('user').length > 0){
                    setTimeout(function(){
                        window.location = '/signupengine.php';
                    },500);
                }else if(data.documentElement.getElementsByTagName('error').length > 0){
                    $('.container.main').find('.alert').remove();
                    $('.container.main').append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap! </strong>"+ data.documentElement.getElementsByTagName('error').getAttribute('content') +"</div>");
                }
            }
        });
    }else if(type == 3){
        if($('#status').val() < 3){
            $('.container.main').find('.alert').remove();
            $('.container.main').append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap! </strong> Status cannot be less than 4 character long. </div>");
            return;
        }
        console.log(Motion.removeSpecial($('#status').val()));
        $.ajax({
            url: '/php/signup.php?t=5&s=' + Motion.removeSpecial($('#status').val()),
            success: function(data){
                if(data.documentElement.getElementsByTagName('user').length > 0){
                    setTimeout(function(){
                        window.location = '/signupengine.php';
                    },500);
                }else if(data.documentElement.getElementsByTagName('error').length > 0){
                    $('.container.main').find('.alert').remove();
                    $('.container.main').append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap! </strong>"+ data.documentElement.getElementsByTagName('error').getAttribute('content') +"</div>");
                }
            }
        });
    }
}

function compile(){
    var checked = $('#intrest-form input:checked');
    if(checked.length < 3){
        Motion.printmessage("You have to select atleast 3 categories.", ".main");
        return;
    }
    var payload = "checked=" + $(checked[0]).attr('name');
    for( var i = 1; i < checked.length; i++ ){
        payload += "-" + $(checked[i]).attr('name');
    }
    payload += "&t=4";
    $.ajax({
        url: '/php/signup.php',
        data: payload,
        type: "GET",
        success: function(data){
            if(data.documentElement.getElementsByTagName('user').length > 0){
                setTimeout(function(){
                    window.location = '/signupengine.php';
                },500);
            }else if(data.documentElement.getElementsByTagName('error').length > 0){
                $('.container.main').find('.alert').remove();
                $('.container.main').append("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap! </strong>"+ data.documentElement.getElementsByTagName('error').getAttribute('content') +"</div>");
            }
        }
    });
}