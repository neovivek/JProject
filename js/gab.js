// var BOSH_SERVICE = 'http://jproject.in:7070/http-bind/';
var BOSH_SERVICE = 'http://localhost:7070/http-bind/';
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
var domain = '@hp/comp';
var dom = '@hp';
var myname;
var Gab = {
	connection : null,

	jid_to_id : function(jid){
		return Strophe.getBareJidFromJid(jid).replace("@","-").replace(".","-");
	},

	on_roster : function(iq){
		$(iq).find('item').each(function(){
			var jid = $(this).attr('jid');
			var name = $(this).attr('name') || jid;
			var jid_id = Gab.jid_to_id(jid);
			var subscription = $(this).attr('subscription');
			if(subscription === 'none'){
			}
			else{
				var contact = $("<li id='" + jid_id + "' class='user-data'><div class='roster-contact user-data-head'><div class='roster-name'>" + name + "</div><div class='roster-status offline'><span class='fa fa-circle'></span></div><div class='roster-jid'></div></div></li>");
				Gab.insert_contact(contact);
			}
		});

		Gab.connection.addHandler(Gab.on_presence,null,"presence");
		Gab.connection.send($pres().c('show').t('chat').up().c('priority').t('5'));
	},

	pending_subscriber : null,


	on_presence : function (presence) {
		var ptype = $(presence).attr('type');
		var from = $(presence).attr('from');
		var jid_id = Gab.jid_to_id(from);
		var name = $(presence).attr('name') || getname(from.split('@')[0]);

		if(ptype === 'subscribe'){
			if(from.indexOf('/') > 0){
				from = from.split('/')[0];
			}
			jid_id = Gab.jid_to_id(from);
			if($('.request-body #'+jid_id).length <= 0) {
				$('.request-body').append("<div class='form-control' id='"+jid_id+"' ><span id='"+name+"' class='heading'> <b>"+name+"</b> wants to be your friend</span><div class='btn-group btn-group-justified'><div class='btn btn-group btn-special request-cancel'>Cancel</div><div class='btn btn-group btn-special request-accept'>Accept</div></div></div>");
				var x = $('.box-text .badge').html();
				if(x) $('.box-text .badge').html(parseInt(x, 10)+1);
				else $('.box-text .badge').html('1');
			}
		}else if(ptype !== 'error' && $('.contact-body .friend-contact .main-data ul li#' + jid_id).length > 0 ){
			var contact = $('.contact-body .friend-contact .main-data ul li#' + jid_id + ' .roster-contact .roster-status').removeClass("online").removeClass("away").removeClass("offline");
			if(ptype === 'unavailable'){
				contact.addClass("offline");
			}
			else{
				var show = $(presence).find('show').text();
				if(show === "" || show === "chat"){
					contact.addClass("online");
				}else{
					contact.addClass("away");
				}
			}

			var li = contact.parent().parent();
			li.remove();
			Gab.insert_contact(li);
		}

		return true;
	},

	on_roster_changed : function(iq){
		$(iq).find('item').each(function(){
			var sub = $(this).attr('subscription');
			var jid = $(this).attr('jid');
			var name = $(this).attr('name') || jid;
			var jid_id = Gab.jid_to_id(jid);

			if(sub === 'remove'){
				$('#' + jid_id).remove();
			}else{
				var contact_html = "<li id='" + jid_id + "' class='user-data'><div class='roster-contact user-data-head'><div class='roster-name'>" + name + "</div><div class='" + ($('#'+jid_id+' .roster-status').attr('class') || "roster-status offline") + "'><span class='fa fa-circle'></span></div><div class='roster-jid'></div></div></li>";

				if($('#'+jid_id).length > 0){
					$('#'+jid_id).replaceWith(contact_html);
				}else{
					Gab.insert_contact(contact_html);
				}
			}
		});

		return true;
	},

	on_message : function(message){
		var full_jid = $(message).attr('from');
		var jid = Strophe.getBareJidFromJid(full_jid);
		var jid_id = Gab.jid_to_id(jid);
		var name = $(message).attr('name');

		if($('#chat1-' + jid_id).length <= 0){
			// console.log($("#messages .badge").html() + '=');
			// var data = $("#messages .badge").html();
			// if(data == '' || data == null) $("#messages .badge").html('1');
			// else $("#messages .badge").html(parseInt($data) + 1);
			// $("#message-list #"+jid_id).remove();
			// $("#message-list").prepend('<li id="'+jid_id+'" class="user-respond"><div class="roster-contact user-respond-head"><div class="roster-name">'+name+'</div></div></li>');
			// return;
			$('#chat-box ul').prepend("<li class='new-chat' id='chat1-"+ jid_id +"'><div class='chat-id'><span>" + name +"</span><div class='close1'>x</div></div><div class='chat1-messages'></div><div class='chat1-input1'><div class='chat1-input2'><textarea class='chat1-input'></textarea></div></div></li>");
			$('#chat1-' + jid_id).data('jid', full_jid);
			getmessage(jid);
			if($(document).width() - 30 < $('#chat-box').width()){
				$('#chat-box ul li:last-child').remove();
			}
		}
		var composing = $(message).find('composing');
		var paused = $(message).find('paused');
		if(composing.length > 0){
			$('#chat1-' + jid_id + ' .chat1-messages').append("<div class='chat-event'>" +	name + " is typing .... </div>");
			Gab.scroll_chat(jid_id);

		}else if(paused.length > 0){
			$('#chat1-' + jid_id + ' .chat-event').remove();
		}else{

			var body = $(message).find('body').contents();
			var date = $(message).find('delay').text();
			var span = $("<span></span>");
			body.each(function(){
				if(document.importNode){
					$(document.importNode(this, true)).appendTo(span);
				}else{
					span.append(this.xml);
				}
			});
			if(span){
				if($('#chat1-'+jid_id + ' .chat1-messages').css('display') == 'none'){
					$('#chat1-'+jid_id +' .chat-id .badge').remove();
					$('#chat1-'+jid_id + ' .chat-id').append('<span class="badge">msg<span>');
				}
				$('#chat1-' + jid_id + ' .chat-event').remove();
				$("#message-list #"+jid_id).remove();
				$("#message-list").prepend('<li id="'+jid_id+'" class="user-respond"><div class="roster-contact user-respond-head"><div class="roster-name">'+name+'</div></div></li>');
				$('#chat1-' + jid_id + ' .chat1-messages').append("<div class='chat1-message'><div class='chat-text-handler'><div class='chat-text-adjust' title='"+ date +"'><div class='chat-text'><div class='inner'></div></div></div></div></div>");
				$('#chat1-' + jid_id +' .chat1-message:last-child .chat-text-handler .chat-text-adjust .chat-text .inner').append(span);
				Gab.scroll_chat(jid_id);
			}
		}
			
		return true;
	},

	scroll_chat : function(jid_id){
		var div = $('#chat1-' + jid_id + ' .chat1-messages').get(0);
		div.scrollTop = div.scrollHeight;
	},

	presence_value : function(elem){
		if(elem.hasClass('online')){
			return 2;
		}else if(elem.hasClass('away')){
			return 1;
		}
		return 0;
	},


	insert_contact: function(elem){
		var jid = elem.find('.roster-jid').text();
		var pres = Gab.presence_value(elem.find('.roster-status'));

		var contacts = $('.contact-body .friend-contact .main-data li');

		if(contacts.length > 0){
			var inserted = false;
			contacts.each(function(){
				var cmp_pres = Gab.presence_value($(this).find('.roster-status'));
				var cmp_jid = $(this).find('.roster-jid').text();

				if(pres > cmp_pres){
					$(this).before(elem);
					inserted = true;
					return false;
				}else{
					if(jid < cmp_jid){
						$(this).before(elem);
						inserted = true;
						return false;
					}
				}
			});
			if(!inserted){
				$('.contact-body .friend-contact .main-data ul').append(elem);
			}
		}else{
			$('.contact-body .friend-contact .back-placeholder').css('display', 'none');
			$('.contact-body .friend-contact .main-data ul').append(elem);
		}
	},

	text_to_xml: function(text){
		i = 0;
		while(text[i] == ' ') i++;
		text = text.substr(i);
		i = text.length - 1;
		while(text[i] == ' ') i--;
		text = text.substr(0, i);
		return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n$/, "").replace(/\n/, "<br>");
	},

	doNothing: function () {}
};

$(document).ready(function(){

	if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
	    var script = document.createElement("script");
	    script.src = "/plugins/flXHR.js";
	    script.type = "text/javascript";
	    document.body.appendChild(script);
	    var script2 = document.createElement("script");
	    script2.src = "/plugins/strophe.flxhr.js";
	    script2.type = "text/javascript";
	    document.body.appendChild(script2);
	}
	
	$(window).resize(function(){
		if($(document).width() - 30 < $('#chat-box').width()){
			$('#chat-box ul li:last-child').remove();
		}
	});

	$('#map').on('click', '.chat-active', function(){
	    var par = $(this).parent().parent().parent();
	    var jid = par.prop('id').split('-')[1];
	    var name = par.find('.box-head span').text();
	    var jid_id = jid + '-hp';
	    jid = jid + dom;

	    if($('#chat1-' + jid_id).length === 0){
	      $('#chat-box ul').prepend("<li class='new-chat' id='chat1-"+ jid_id +"'><div class='chat-id'><span>" + name +"</span><div class='close1'>x</div></div><div class='chat1-messages'></div><div class='chat1-input1'><div class='chat1-input2'><textarea class='chat1-input'></textarea></div></div></li>");
	      $('#chat1-' + jid_id).data('jid', jid);
	      getmessage(jid);
	      if($(document).width() - 30 < $('#chat-box').width()){
	        $('#chat-box ul li:last-child').remove();
	      }
	    }

		$('#chat1-'+jid_id+' textarea').focus();
	});

	$('.contact-body').on('click', '.roster-contact', function(){
		var jid_id = $(this).parent().attr('id');
		var name = $(this).find('.roster-name').text();
		var jid = jid_id.replace('-', '@');

		if($('#chat1-' + jid_id).length === 0){
			$('#chat-box ul').prepend("<li class='new-chat' id='chat1-"+ jid_id +"'><div class='chat-id'><span>" + name +"</span><div class='close1'>x</div></div><div class='chat1-messages'></div><div class='chat1-input1'><div class='chat1-input2'><textarea class='chat1-input'></textarea></div></div></li>");
			$('#chat1-' + jid_id).data('jid', jid);
			getmessage(jid);
			if($(document).width() - 30 < $('#chat-box').width()){
				$('#chat-box ul li:last-child').remove();
			}
		}

		$('#chat1-'+jid_id+' textarea').focus();
	});
	$('#message-list').on('click', '.roster-contact', function(){
		var jid_id = $(this).parent().attr('id');
		var name = $(this).find('.roster-name').text();
		var jid = jid_id.replace('-', '@');

		if($('#chat1-' + jid_id).length === 0){
			$('#chat-box ul').prepend("<li class='new-chat' id='chat1-"+ jid_id +"'><div class='chat-id'><span>" + name +"</span><div class='close1'>x</div></div><div class='chat1-messages'></div><div class='chat1-input1'><div class='chat1-input2'><textarea class='chat1-input'></textarea></div></div></li>");
			$('#chat1-' + jid_id).data('jid', jid);
			getmessage(jid);
			if($(document).width() - 30 < $('#chat-box').width()){
				$('#chat-box ul li:last-child').remove();
			}
		}

		$('#chat1-'+jid_id+' textarea').focus();
	});
	$("#messages").click(function(){
		$("#messages .badge").html('');
	});

	$(document).on('keyup', '.chat1-input', function(ev){
		var jid = $(this).parent().parent().parent().data('jid');
		var body = Gab.text_to_xml($(this).val());

		if(ev.which === 13){
			ev.preventDefault();

			var now= new Date();
		    ampm= 'am';
		    h= now.getHours();
		    m= now.getMinutes();
		    if(h>= 12){
		        if(h>12) h -= 12;
		        ampm= 'pm';
		    }
		    if(m<10) m= '0'+m;
		    var date = h+":"+m+ampm;

			if(body !== "" ){
				var message =$msg({
					to: jid,
					"type": "chat", name : myname}).c('body').t(body).up().c('active', {xmlns:"http://jabber.org/protocol/chatstates"}).up().c('delay').t(date);
				Gab.connection.send(message);

				$(this).parent().parent().parent().find('.chat1-messages').append("<div class='chat1-message'><div class='chat1-text-handler'><div class='chat1-text-adjust' title='"+ date +"'><div class='chat1-text'><div><span>" + body + "</span></div></div></div></div></div>");
				Gab.scroll_chat(Gab.jid_to_id(jid));
			}
			$(this).val('');
			$(this).parent().parent().parent().data('composing', false);
			$(this).height(15);
			$(this).parent().parent().parent().find('.chat1-messages').height(243);
			$('#chat1-' + Gab.jid_to_id(jid) + ' .chat1-input1').height(26);
		}else if(!body){
			var notify = $msg({to: jid, "type": "chat", name: myname}).c('paused', {xmlns:"http://jabber.org/protocol/chatstates"});
			Gab.connection.send(notify);
			$(this).parent().parent().parent().data('paused', true);
			$(this).parent().parent().parent().data('composing', false);
			$(this).height(15);
			$(this).parent().parent().parent().find('.chat1-messages').height(243);
			$('#chat1-' + Gab.jid_to_id(jid) + ' .chat1-input1').height(26);
		}else{
			var composing = $(this).parent().parent().parent().data('composing');
			if(!composing){
				$(this).parent().parent().parent().data('paused', false);
				var notify = $msg({to:jid, "type": "chat", name: myname }).c('composing', {xmlns: "http://jabber.org/protocol/chatstates"});
				Gab.connection.send(notify);
				$(this).parent().parent().parent().data('composing', true);
			}
			var Height = this.scrollHeight;
			$(this).height(Height);
			$(this).parent().parent().parent().find('.chat1-messages').height(Math.max( 259 - Height, 259 - 69));
			document.getElementById('chat1-' + Gab.jid_to_id(jid)).lastChild.style.height = Math.min( 10 + Height, 80) + "px";
		}
	});

	$(document).on('click', '.close1', function(){
		$(this).parent().parent().remove();
	});

	$(document).on('click', '.chat-id', function(){
		if($(this).parent().find('.chat1-messages').css("display") === "block"){
			$(this).parent().find('.chat1-messages').css("display","none");
			$(this).parent().find('.chat1-input1').css("display","none");
			$(this).css('background-color', '#fff').css('color', '#345');
		} else{
			$(this).parent().find('.chat1-messages').css("display","block");
			$(this).parent().find('.chat1-input1').css("display","block");
			$(this).find('.badge').remove();
			$(this).css('background-color', '#A00000').css('color', '#fff');
		}
	});
});


function connect(data){
	var connection = new Strophe.Connection(BOSH_SERVICE);
	
	connection.rawInput = function(data){
	}
    connection.rawOutput = function (data) {
    	$.cookie('rid', connection._proto.rid);
    	$.cookie('sid', connection._proto.sid);
    };
    myname = data.name;
	connection.connect(data.jid + domain, data.password, function(status){
		$.cookie('jid', data.jid+domain);
		if (status === Strophe.Status.CONNECTING) {
	    } else if (status === Strophe.Status.CONNFAIL) {
	    } else if (status === Strophe.Status.DISCONNECTING) {
	    } else if (status === Strophe.Status.DISCONNECTED) {
			disconnected();
	    } else if (status === Strophe.Status.CONNECTED) {
			connected();
		} else if (status === Strophe.Status.AUTHFAIL) {
			disconnected();
		}
	});
	Gab.connection = connection;
}

function connected(){
	var iq = $iq({"type": "get"}).c('query', {xmlns: 'jabber:iq:roster'});
	Gab.connection.sendIQ(iq, Gab.on_roster);
	Gab.connection.addHandler(Gab.on_roster_changed, "jabber:iq:roster", "iq", "set");
	Gab.connection.addHandler(Gab.on_message, null, "message", "chat");
	getMessageContact();
}

function contact_added(data){
	var iq = $iq({"type": "set"}).c("query", {xmlns: "jabber:iq:roster"}).c("item", data);
	Gab.connection.sendIQ(iq);
	var subscribe = $pres({to: data.jid, "type": "subscribe", name: data.myname});
	Gab.connection.send(subscribe);
}

function disconnected(){
	Gab.connection = null;
	Gab.pending_subscriber = null;
	setTimeout(function(){
        window.location = '/php/error.php';
      },3000);
}

function getmessage(jid){
	$.ajax({
		url: '/php/check.php?jid='+Gab.connection.jid.split('@')[0], 
		success: function(data){ 
			if(data.documentElement.getElementsByTagName('success').length <= 0) window.location = '/';
		}
	});
	Gab.connection.archive.listCollections(jid, new Strophe.RSM({max: 15}), function (collections, responseRsm) {
		for (var int = collections.length - 1; int >= 0; int--) {
		    var lastCollection = collections[int];
		    rsm = new Strophe.RSM({max: 50});
		    lastCollection.retrieveMessages(rsm, function (messages, responseRsm) {
		    while(messages.length){
		      	var d = messages.pop();
		      	var now= d.timestamp;
			    ampm= 'am';
			    da= now.getDate();
			    mo= now.getMonth()+1;
			    yr= now.getYear()+1900;
			    h= now.getHours();
			    m= now.getMinutes();
			    if(h>= 12){
			        if(h>12) h -= 12;
			        ampm= 'pm';
			    }
			    if(m<10) m= '0'+m;
			    var date = da+"-"+mo+"-"+yr+" "+h+":"+m+ampm;
		      	if(Strophe.getBareJidFromJid(d.from) === jid){
		      		$('#chat1-'+ Gab.jid_to_id(jid) +' .chat1-messages').prepend("<div class='chat1-message'><div class='chat-text-handler'><div class='chat-text-adjust' title='"+ date +"'><div class='chat-text'><div class='inner'>" + d.body +"</div></div></div></div></div>");
		      	}
		      	else{
		      		$('#chat1-'+ Gab.jid_to_id(jid) +' .chat1-messages').prepend("<div class='chat1-message'><div class='chat1-text-handler'><div class='chat1-text-adjust' title='"+ date +"'><div class='chat1-text'><div><span>" + d.body + "</span></div></div></div></div></div>");
		      	}
		    }
			Gab.scroll_chat( Gab.jid_to_id(jid) );
		    });
		}
	});
}

function callattach(){
	connect({jid: $.cookie('jid'), resource: 1});
}

function getname(id){
	var name;
	$.ajax({ 
		url: '/php/name.php?n='+id, 
		async: false,
		success: function(data){name = data; }
	});
	return name;
}

function getMessageContact(){
	$.ajax({
		url: '/php/getMessageContact.php?i='+Gab.connection.jid,
		success: function(data){
			$('#message-list').prepend(data);
		}
	});
}