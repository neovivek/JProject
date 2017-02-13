var iconURLPrefix = 'http://maps.google.com/mapfiles/ms/icons/';

var icons = [
  iconURLPrefix + 'blue-dot.png',
  iconURLPrefix + 'yellow-dot.png',
  iconURLPrefix + 'red-dot.png',
  iconURLPrefix + 'green-dot.png',
  iconURLPrefix + 'orange-dot.png',
  iconURLPrefix + 'purple-dot.png',
  iconURLPrefix + 'pink-dot.png',
]
var icons_length = icons.length;
var myname;
var domain = '@hp/comp';
var dom = '@hp';
var map;
var marker_array = [];
var marker_data = [];
var infoWindow;

function load(query) {

  var initialLocation;
  var siberia = new google.maps.LatLng(60, 105);
  var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
  var browserSupportFlag =  new Boolean();
  var lat;
  var lon;
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    mapTypeId: 'roadmap',
    disableDefaultUI: true
  });

  if(navigator.geolocation) {
    browserSupportFlag = true;
    var watchid = navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      initialLocation = new google.maps.LatLng(lat, lon);
      map.setCenter(initialLocation);
      $.ajax({
        url: "/php/locverify.php?latitude="+lat+"&longitude="+lon+"&query="+query,
        success: maphandle
      });
    }, function(error) {
      handleNoGeolocation(browserSupportFlag, error);
    });
  }
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag, error);
  }

  function handleNoGeolocation(errorFlag, error) {
    if (errorFlag == true) {
      alert("Geolocation service failed. Try again or go to your settings and allow this site to use your location.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation.");
      initialLocation = siberia;
    }
    alert('code: '    + error.code    + '\nmessage: ' + error.message + '\n');
    // window.location = '/php/error.php';
    console.log('map error');
    map.setCenter(initialLocation);
  }

  infoWindow = new google.maps.InfoWindow;

  function maphandle(data) {
    var iconCounter = 0;
    var xml = data.documentElement;
    if(data.documentElement.getElementsByTagName('error').length > 0){
      // window.location = '/php/error.php';
      console.log('no responseXML');
      return;
    }
    var users = xml.getElementsByTagName("user");
    var id = users[0].getAttribute("id");
    var pass = users[0].getAttribute("password");
    var resource = users[0].getAttribute("resource");
    myname = users[0].getAttribute("myname");
    var uname = users[0].getAttribute("name");
    var umobile = users[0].getAttribute("mobile");
    var umail = users[0].getAttribute("mail");
    $.cookie('uusername', myname);$.cookie('uname', uname);$.cookie('umobile', umobile);$.cookie('umail', umail);
    $('#profile-name a').html( ($.cookie("uname")).split(' ')[0] );

    connect({jid: id, password: pass, name: myname, resource: resource});
    var markers = xml.getElementsByTagName("marker");
    for (var i = 0; i < markers.length; i++) {
      var name = markers[i].getAttribute("name");
      var address = markers[i].getAttribute("address");
      var type = markers[i].getAttribute("type");
      var about = markers[i].getAttribute("about");
      var uid = markers[i].getAttribute("userid");
      var gender = markers[i].getAttribute("gender");
      var point = new google.maps.LatLng(
          parseFloat(markers[i].getAttribute("lat")),
          parseFloat(markers[i].getAttribute("lng")));
      var temp = markers[i].getAttribute("intrest");
      temp = temp.split('-');
      var intrests = temp[0];
      for(var ii=1; ii<temp.length; ii++){
        intrests += ", "+temp[ii];
      }
      if(name === myname){
        var html = "<div class='box' id='user-"+uid+"-hp'><div class='box-head'><span>"+ name +"</span></div>"+
          "<div class='box-body'><div class='box-text'>"+ about +"</div><div><b>Interests: </b>"+intrests+"</div>"+"<div class='box-text'><span><b>From: </b></span><span>"+ address +"</span></div><div class='box-text'><span><b>Gender: </b></span><span>"+ gender +"</span></div></div>"+
          "</div>";
      }else{
        var html = "<div class='box' id='user-"+uid+"-hp'><div class='box-head'><span>"+ name +"</span></div>"+
          "<div>"+intrests+"</div>"+
          "<div class='box-foot'><div class='btn-group btn-group-justified button-map'><div class='btn btn-group btn-special chat-active' >Chat With Me</div><div class='btn btn-group btn-special request-active' >Add Me</div></div></div></div>";

        $(".map-contact .main-data ul").append("<li class='user-data' id='user-"+uid+"-hp' onclick='open_infoWindow("+i+")'><div class='user-data-head'><span>"+ name +"</span></div><div class='user-data-body'><div class='user-data-text'>"+ about +"</div><span class='user-data-text'><span class='fa fa-map-marker'></span><span> "+ address +"</span></span>&nbsp;&nbsp;<span class='user-data-text'><span class='fa fa-venus-mars'></span><span> "+ gender +"</span></span></div>"+
          "</li>");
      }
      var marker = new google.maps.Marker({
        map: map,
        position: point,
        icon: icons[iconCounter]
      });
      marker_array.push(marker);
      marker_data.push(html);
      bindInfoWindow(marker, map, infoWindow, html);
      google.maps.event.addListener(map, 'click', function() {
          infoWindow.close();
      });
      iconCounter++;
      if(iconCounter >= icons_length){
        iconCounter = 0;
      }

    }
  }

}

function open_infoWindow(i){
  infoWindow.setContent(marker_data[i]);
  infoWindow.open(map, marker_array[i]);
}

function bindInfoWindow(marker, map, infoWindow, html) {
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
}

function doNothing() {}

$(document).ready(function() {

  $('body').css('min-height', $(window).height());
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  })

  $('#logout').on('click', function(){
    Gab.connection.disconnect();
    Gab.connection = null;
    setTimeout(function(){
      window.location = '/php/error.php';
      console.log('Gab logout');
    },3000);
  });

  $('#request-show').on('click', function(){
    $('.request-body').css('display', 'block');
  });
  $('.request-hide').on('click', function(){
    $('.request-body').css('display', 'none');
  });
  $('.sort-opener').on('click', function(){
    $('.sort-options').css('display', 'block');
  });
  $('.sort-hide').on('click', function(){
    $('.sort-options').css('display', 'none');
  });

  $('.request-body').on('click', '.request-cancel', function(){
    var id = $(this).parent().parent().attr('id').replace('-', '@');
    Gab.connection.send($pres({ to: id, "type": "unsubscribed"}));
    Gab.connection.send($pres({ to: id, "type": "unsubscribe"}));
    $(this).parent().parent().remove();
    var iq = $iq({"type": "set"}).c('query', {xmlns: 'jabber:iq:roster'}).c('item', {jid: id, subscription:"remove"});
    Gab.connection.sendIQ(iq);
    var x = $('.box-text .badge').text();
    if(x>1) $('.box-text .badge').text(parseInt(x)-1);
    else $('.box-text .badge').text('0');
    Gab.pending_subscriber = null;
  });

  $('.request-body').on('click', '.request-accept', function(){
    var id = $(this).parent().parent().attr('id').replace('-', '@');
    var name = $(this).parent().parent().find('span').attr('id');
    var iq = $iq({"type": "set"}).c("query", {xmlns: "jabber:iq:roster"}).c("item", {jid: id, name: name});
    Gab.connection.sendIQ(iq);
    Gab.connection.send($pres({to: id,"type": "subscribed"}));
    Gab.connection.send($pres({to: id,"type": "subscribe", name: $.cookie('uusername')}));
    Gab.pending_subscriber = null;
    var x = $('.box-text .badge').text();
    if(x>1) $('.box-text .badge').text(parseInt(x)-1);
    else $('.box-text .badge').text('0');
    $(this).parent().parent().remove();
  });

  $('#map').on('click', '.request-active', function(){
    var par = $(this).parent().parent().parent();
    var jid = par.prop('id').split('-')[1];
    var name = par.find('.box-head span').text();
    contact_added({jid: jid+dom, name: name, myname: myname});
  });

  $('#bug-active').click(function(){
    var email = Motion.testEmail('#bugmail', '#bug-container .modal-body');
    if(email){
      var sub = Motion.testLength("#bug", "subject", "#bug-container .modal-body", 3);
      if(sub){
        var content = Motion.testLength("#bugbody", "content", "#bug-container .modal-body", 11);
      }
    }
    to = $('#bugmail').val();
    sub = $('#bug').val();
    b = $('#bugbody').val();
    if( content ){
      $.ajax({
        url: '/php/bugsubmit.php?to='+to+'&sub='+sub+'&b='+b,
        type: 'GET',
        success: function(data){
          $('#bugmail').parent().find('.glyphicon').remove();
          $('#bug-container').find('.alert').remove();
          if(data.documentElement.getElementsByTagName('success').length > 0){
            Motion.printmessage(" We have submitted your request and will try to resolve it as soon as possible.", '#bug-container .modal-header', "success");
            $('#bugmail').val('');
            $('#bug').val('');
            $('#bugbody').val('');
          }else{
            Motion.printmessage("Please check your Email Id or try after some time.", '#bug-container .modal-header');
          }
        }
      });
    }
  });
  
  $('.contact-pad .btn-special').click(function(){
    var button = $(this).attr('class');
    if(button.indexOf('active') != -1)
      return;
    if($(window).width() >= '900'){
      if($('.slot').css('position') == 'relative')
        $('.slot').css('position', 'static');
      else 
        $('.slot').css('position', 'relative');
    }
    $('.list').css("display", 'none');
    $('.btn-special').removeClass('active');
    $(this).addClass('active');
    $($(this).attr("data-target")).css('display', 'block');
  });
  
  if($(window).width() < '900'){
      $('.left-slot').width('100%');
      $('.right-slot').width('100%').css('right', '-100%').css('position', 'absolute');
      $('.navbar.navbar-fixed-top').width('100%');
      $('.slot-opener').css('display', 'block');
  }else{
      $('.left-slot').width('75%');
      $('.right-slot').width('25%').css('right', 'auto').css('position', 'relative');
      $('.navbar.navbar-fixed-top').width('74%');
      $('.slot-opener').css('display', 'none');
  }
  $('.slot-opener').click(function(){
    if($('.right-slot').css('right') == '0px'){
      $('.right-slot').css('right', '-100%');
    }else{
      $('.right-slot').css('right', '0');
    }
  });

  if(window.location.pathname !== ''){
    var openElement = window.location.hash;
    if(openElement == '#profile'){
      $('.navbar-nav li').removeClass('active');
      $('#profile-name').addClass('active');
      if($('.l-profile').length > 0){
        $(".left-slot .item").css('display', 'none');
        $('.l-profile').css('display', 'block');
      }else{
        $.ajax({
          url: '/pro.php?id='+$.cookie('jid').split('@')[0],
          success: function(data){
            $(".left-slot .item").css('display', 'none');
            $('.left-slot.slot').append('<div class="left-item item l-profile">'+data+'</div>');
            $('.l-profile').css('display', 'block');
          }
        });
      }
    }else if(openElement == '#settings'){
      $('.navbar-nav li').removeClass('active');
      if($('.l-setting').length > 0){
        $(".left-slot .item").css('display', 'none');
        $('.l-setting').css('display', 'block');
        return;
      }
      $.ajax({
        url: '/settings.php',
        success: function(data){
          $(".left-slot .item").css('display', 'none');
          $('.left-slot.slot').append('<div class="left-item item l-setting">'+data+'</div>');
          $('.l-setting').css('display', 'block');
        }
      });
    }
  }
  
  $('.navbar-nav li').click(function(){
    var openElement = $(this).find('a').attr('href');
    if(openElement == '#profile'){
      $('.navbar-nav li').removeClass('active');
      $('#profile-name').addClass('active');
      if($('.l-profile').length > 0){
        $(".left-slot .item").css('display', 'none');
        $('.l-profile').css('display', 'block');
        return;
      }
      $.ajax({
        url: '/pro.php?id='+$.cookie('jid').split('@')[0],
        success: function(data){
          $(".left-slot .item").css('display', 'none');
          $('.left-slot.slot').append('<div class="left-item item l-profile">'+data+'</div>');
          $('.l-profile').css('display', 'block');
        }
      });
    }else if(openElement == '#settings'){
      $('.navbar-nav li').removeClass('active');
      if($('.l-setting').length > 0){
        $(".left-slot .item").css('display', 'none');
        $('.l-setting').css('display', 'block');
        return;
      }
      $.ajax({
        url: '/settings.php',
        success: function(data){
          $(".left-slot .item").css('display', 'none');
          $('.left-slot.slot').append('<div class="left-item item l-setting">'+data+'</div>');
          $('.l-setting').css('display', 'block');
        }
      });
    }
  })
});

$(window).resize(function(){

  $('body').css('min-height', $(window).height());

  if($(window).width() < '900'){
      $('.left-slot').width('100%');
      $('.right-slot').width('100%').css('right', '-100%').css('position', 'absolute');
      $('.navbar.navbar-fixed-top').width('100%');
      $('.slot-opener').css('display', 'block');
  }else{
      $('.left-slot').width('75%');
      $('.right-slot').width('25%').css('right', 'auto').css('position', 'relative');
      $('.navbar.navbar-fixed-top').width('74%');
      $('.slot-opener').css('display', 'none');
  }
});

function checkAll(){
  checked = $('.sort-options ul li input:checked');
  if(checked.length == 0){
    window.location = '/home.php';
    return;
  }
  var checkedData = "-"+$(checked[0]).attr('name');
  for(var i=1; i<checked.length; i++)
    checkedData += '-'+$(checked[i]).attr('name');
  window.location = '/home.php?q='+checkedData;
}