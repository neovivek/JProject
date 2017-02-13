$(document).ready(function(){

	$('#profile-name a').text(($.cookie("uname")).split(' ')[0]);
	$('#cname .col-sm-8 div').append("You current name is <b style='text-transform:capitalize'>"+($.cookie("uname"))+"</b>");
	$('#cmail .col-sm-8 div').append("Your registered mail-id with us <b>"+($.cookie("umail"))+"</b>");
	$('#cuname .col-sm-8 div').append("Your username <b>"+($.cookie("uusername"))+"</b>");

	$('.edit-buttons').click(function (){
		$(this).parent().parent().css('display', 'none');
		$(this).parent().parent().parent().find('.secondary-form').css('display', 'block');
	});

	$('.close-button').click(function (){
		$(this).parent().parent().parent().css('display', 'none');
		$(this).parent().parent().parent().parent().find('.primary-form').css('display', 'block');
	});

	$('.secondary-form').attr('style', 'margin-bottom:-5px;');

	$('.save-button').click(function(){
		var par = $(this).parent().parent().parent().parent();
		var thisid = par.attr('id');
		if(thisid === 'cname'){
			var a = $(this).parent().parent().find('.input-sm').val();
			var arr = "~`@!#$%^&*+=-[]\\\';,/{}|\":<>?0123456789";
			if(a.length > 3){
			    for(i=0; i<a.length; i++){
			        if(arr.indexOf(a.charAt(i)) !== -1){break;}
			    }
			    if(i === a.length){
					$.ajax({
						url: '/php/datamod.php?name='+a, 
						success: function(data){
							if(data.documentElement.getElementsByTagName('success').length > 0){
								par.find('.form-group span').remove();
								par.find('.secondary-form .alert').remove();
								par.find('.secondary-form').prepend("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Congrats!</strong> We have changed your name</div>");
								$.cookie('uname', a);
								par.find('.input-sm').val('');
							}else if(data.documentElement.getElementsByTagName('error')[0].getAttribute('content') === 'rocket'){
								window.location = '/';
							}else {
								par.find('.secondary-form .alert').remove();
								par.find('.secondary-form').prepend("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap!</strong>"+ data.documentElement.getElementsByTagName('error')[0].getAttribute('content') +"</div>");
							}
						}
					});
			    }else{
			    	$(this).parent().parent().find('span').remove();
			        $(this).parent().parent().find('.form-group:first-child').append("<span class='text-danger'>Please check the Name again.</span>");
			    }
			}else{
				$(this).parent().parent().find('span').remove();
			    $(this).parent().parent().find('.form-group:first-child').append("<span class='text-danger'>Please check the Name again.</span>");
			}
		}else if(thisid === 'cmail'){
			m = $(this).parent().parent().find('.input-sm').val();
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		if(filter.test(m)){
				$.ajax({
					url: '/php/datamod.php?email='+m, 
					success: function(data){
						if(data.documentElement.getElementsByTagName('success').length > 0){
							par.find('.form-group span').remove();
							par.find('.secondary-form .alert').remove();
							par.find('.secondary-form').prepend("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Congrats!</strong> We have changed your email id.</div>");
							$.cookie('umail', m);
							par.find('.input-sm').val('');
						}else if(data.documentElement.getElementsByTagName('error')[0].getAttribute('content') === 'rocket'){
							window.location = '/';
						}else {
							par.find('.secondary-form .alert').remove();
							par.find('.secondary-form').prepend("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap!</strong>"+ data.documentElement.getElementsByTagName('error')[0].getAttribute('content') +"</div>");
						}
					}
				});
			}else{
				$(this).parent().parent().find('span').remove();
				$(this).parent().parent().find('.form-group:first-child').append("<span class='text-danger'>Please check the Email again.</span>");
			}
		}else if(thisid === 'cuname'){
			var b = $(this).parent().parent().find('.input-sm').val();
			var arr = " ~`@!#$%^&*+=[]\\\';,/{}|\":<>?";
			if(b.length > 5){
			    for(i=0; i<b.length; i++){
			        if(arr.indexOf(b.charAt(i)) !== -1){break;}
			    }
			    if(i === b.length){
					$.ajax({
						url: '/php/datamod.php?uname='+b, 
						success: function(data){
							console.log(data); 
							if(data.documentElement.getElementsByTagName('success').length > 0){
								par.find('.form-group span').remove();
								par.find('.secondary-form .alert').remove();
								par.find('.secondary-form').prepend("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Congrats!</strong> We have changed your username .</div>");
								$.cookie('uusername', b);
								par.find('.input-sm').val('');
							}else if(data.documentElement.getElementsByTagName('error')[0].getAttribute('content') === 'rocket'){
								window.location = '/';
							}else {
								par.find('.secondary-form .alert').remove();
								par.find('.secondary-form').prepend("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap!</strong>"+ data.documentElement.getElementsByTagName('error')[0].getAttribute('content') +"</div>");
							}
						}
					});
			    }else{
			    	$(this).parent().parent().find('span').remove();
			        $(this).parent().parent().find('.form-group:first-child').append("<span class='text-danger'>Please check the Userame again .</span>");
			    }
			}else{
				$(this).parent().parent().find('span').remove();
			    $(this).parent().parent().find('.form-group:first-child').append("<span class='text-danger'>Please check the Userame again( atleast 6 characters	 ).</span>");
			}
		}else{
			var c = $(this).parent().parent().find('.input-sm.oldie').val();
			var d = $(this).parent().parent().find('.input-sm.newbi').val();
			var e = $(this).parent().parent().find('.input-sm.newbiv').val();

			if(d === e && d.length > 0){
				$.ajax({
					url: '/php/datamod.php?passold='+c+'&passnew='+d+'&passnewv='+e, 
					success: function(data){
						if(data.documentElement.getElementsByTagName('success').length > 0){
							par.find('.form-group span').remove();
							par.find('.secondary-form .alert').remove();
							par.find('.secondary-form').prepend("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Congrats!</strong> We have changed your password .</div>");
							par.find('.input-sm').val('');
						}else if(data.documentElement.getElementsByTagName('error')[0].getAttribute('content') === 'rocket'){
							window.location = '/';
						}else {
							par.find('.secondary-form .alert').remove();
							par.find('.secondary-form').prepend("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Oh Snap!</strong>"+ data.documentElement.getElementsByTagName('error')[0].getAttribute('content') +"</div>");
						}
					}
				});
			}else{
				$(this).parent().parent().find('span').remove();
			    $(this).parent().parent().find('.form-group:first-child').append("<span class='text-danger'>Please check Password and Confirm Password again.</span>");	
			}
		}
	});
});
