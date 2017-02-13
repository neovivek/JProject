<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="author" content="">
  <link rel="icon" href="/favicon.png">
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
  <title> J-Project </title>

  <!-- Bootstrap core CSS -->
  <link href="/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/bootstrap-theme.min.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="/css/dashboard.css">
  <link rel="stylesheet" type="text/css" href="/css/gab.css">
  <!-- Custom styles for this template -->
  // <script src="http://maps.google.com/maps/api/js?sensor=true"></script>
  <script src="js/jquery.min.js"></script>
  <script src="/js/ie-emulation-modes-warning.js"></script>
  <script src="/js/ie10-viewport-bug-workaround.js" ></script>
  <script src="/strophe.js"></script>
  <script src="/plugins/strophe.rsm.js"></script>
  <script type="text/javascript" src="/js/gab.js"></script>
  <script type="text/javascript" src="/js/mainmap.js"></script>
</head>
<body onload="javascript: load();">
	<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">J-Project</a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li class="active"><a>Home</a></li>
          <li><a href="#about">About</a></li>
          <li id="profile-name"><a></a></li>
          <li><a href="#messages">Messages<span class="badge"></span></a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Options<span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
              <li><a href="/settings.php">Settings</a></li>
              <li><a data-toggle="modal" data-target="#bug-container" >Report bug</a></li>
              <li class="divider"></li>
              <li id="logout"><a>Log Out</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="request-box">
    <div class="opener">
      <div id="request-show">Requests</div>
    </div>
    <div class="request-body">
      <div class="request-hide close"> X </div>
      <div class="box-text">
        You have <span class="badge">0</span> requests
      </div>
    </div>
  </div>
  <div class="">
    
  </div>
  <div id="chat-box">
    <ul></ul>
  </div>
  <div class="container main-box">
  	<div class="left-slot slot">
  		<div class="left-item item l-contact">
  			<div class="contact-box">
		      <div id="contact-show">Contacts</div>
		      <div class="contact-body">
		        <ul></ul>
		      </div>
		    </div>
  		</div>
  	</div>
  	<div class="right-slot slot">
  		<div class="right-item item r-map">
			<div id="map"></div>
		</div>
  	</div>
  </div>

  <div class="modal fade" id="bug-container" tabindex="-1" role="dialog" aria-labelledby="bugsubmit" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="bugmodal">Please fill in the details about problem you faced</h4>
        </div>
        <div class="modal-body">
            <div class="form-group has-feedback">
              <label for="recipient-name" class="control-label">Enter your Email Address:</label>
              <input type="email" class="form-control" id="bugmail" required="required" placeholder="Email address">
            </div>
            <div class="form-group has-feedback">
              <label for="recipient-name" class="control-label">Subject: </label>
              <input type="email" class="form-control" id="bug" required="required" placeholder="Subject">
            </div>
            <div class="form-group has-feedback">
              <label for="recipient-name" class="control-label">Enter Details about bug you faced: </label>
              <textarea type="email" class="form-control" id="bugbody" required="required" placeholder="Detailed description of Bug ." data-toggle="tooltip" data-placement="bottom" title="As of now we don't have support for submission of other media types so please try to explain it in detailed description"></textarea>
            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" id="bug-active" class="btn btn-primary">Submit Report</button>
        </div>
      </div>
    </div>
  </div>

  <script src="/js/bootstrap.min.js"></script>
  <script src="/js/docs.min.js"></script>
  <script type="text/javascript" src="/jquery-cookie-master/src/jquery.cookie.js"></script>
</body>
</html>