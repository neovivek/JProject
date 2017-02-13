var Motion = {
    refreshCaptcha: function(){
        var img = document.images['captchaimg'];
        img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
    },
    printmessage: function(message, location, type, sendBodyToTop, sendElementToTop){
        type = type || "danger";
        sendBodyToTop = (sendBodyToTop == false)? false: true;
        $(location).find('.alert').remove();
        if(message){
            $(location).prepend("<div class='alert alert-"+type+" alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap!</strong> "+message+" </div>");
            if(sendBodyToTop){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }else{
                $("html, body").animate({ scrollTop: $(sendElementToTop).offset().top }, "slow");
            }
        }
    },
    testText: function(source, name, outputDiv, sendBodyToTop){
        sendBodyToTop = (sendBodyToTop == false)? false: true;
        f = $(source).val();
        var arr2 = "~`@!#$%^&*+=[]\\\';,-/{}|\":<>?";
        if(f.length > 2){
            for(i=0; i<f.length; i++){
                if(arr2.indexOf(f.charAt(i)) !== -1){break;}
            }
            if(i=== f.length){
                $(source).parent().find('.glyphicon').remove();
                $(source).parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
                return true;
            }else{
                $(source).parent().find('.glyphicon').remove();
                $(source).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
                Motion.printmessage(name+" name should be in english and can't have special characters.", outputDiv, "", sendBodyToTop, outputDiv.split(' ')[0]); return false;
            }
        }else{
            $(source).parent().find('.glyphicon').remove();
            $(source).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage(name+" name should be atleast 3 characters long.", outputDiv, "", sendBodyToTop, outputDiv.split(' ')[0]); return false;
        }
    },
    testTextRigid: function(source, name, outputDiv, sendBodyToTop){
        sendBodyToTop = (sendBodyToTop == false)? false: true;
        a = $(source).val();
        var arr = "~`@!#$%^&*+=-[]\\\';,/{}|\":<>?0123456789";
        if(a.length > 2){
            for(i=0; i<a.length; i++){
                if(arr.indexOf(a.charAt(i)) !== -1){break;}
            }
            if(i === a.length){
                $(source).parent().find('.glyphicon').remove();
                $(source).parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
                return true;
            }else{
                $(source).parent().find('.glyphicon').remove();
                $(source).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
                Motion.printmessage("Your "+name+" can't have special characters or numbers.", outputDiv, "", sendBodyToTop, outputDiv.split(' ')[0]); return false;
            }
        }else{
            $(source).parent().find('.glyphicon').remove();
            $(source).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage("Your "+name+" should have atleast 3 charachters.", outputDiv, "", sendBodyToTop, outputDiv.split(' ')[0]); return false;
        }
    },
    testEmail: function(source, outputDiv, sendBodyToTop){
        sendBodyToTop = (sendBodyToTop == false)? false: true;
        b = $(source).val();
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!filter.test(b)){
            $(source).parent().find('.glyphicon').remove();
            $(source).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage("Your email does not match a valid email string.",outputDiv, "", sendBodyToTop, outputDiv.split(' ')[0]); return false;
        }else{
            $(source).parent().find('.glyphicon').remove();
            $(source).parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
            return true;
        }
    },
    testLength: function(source, name, outputDiv, len, sendBodyToTop){
        sendBodyToTop = (sendBodyToTop == false)? false: true;
        c = $(source).val();
        if(c.length > len){
            $(source).parent().find('.glyphicon').remove();
            $(source).parent().append("<span class='glyphicon glyphicon-ok form-control-feedback green' aria-hidden='true'></span>");
            return true;
        }else{
            $(source).parent().find('.glyphicon').remove();
            $(source).parent().append("<span class='glyphicon glyphicon-remove form-control-feedback red' aria-hidden='true'></span>");
            Motion.printmessage(name+" should be atleast "+ (parseInt(len)+1) +" characters long.", outputDiv, "", sendBodyToTop, outputDiv.split(' ')[0]); return false;
        }
    },
    removeSpecial: function(data){
        return data.replace(/\s/g, '+');
    }
}