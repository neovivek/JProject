<?php
  session_start();
  require('/php/connectdb.php');

  $connection=mysqli_connect ('localhost', $username, $password);
  if (!$connection) {
    die('Not connected : ' . mysql_error());
  }

  $db_selected = mysqli_select_db($connection, $database) or die ('Can\'t use db : ' . mysql_error());
  if(isset($_SESSION['userid'])){
    $result = mysqli_query($connection, 'SELECT signupLevel FROM `markers` WHERE id="'.$_SESSION['userid'].'" ')or die('Can\'t process right now ');
    $res = mysqli_fetch_array($result);
    $level = $res['signupLevel'];
    if($level < 5)
      header("Location: /signupengine.php");
  }
  if(!isset($_SESSION['userid'])){
      header('Location: /');
  }
?>
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
  <title> J Project </title>

  <!-- Bootstrap core CSS -->
  <link href="/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/bootstrap-theme.min.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="/css/dashboard.css">
  <link rel="stylesheet" type="text/css" href="/css/gab.css">
  <link rel="stylesheet" type="text/css" href="/css/font-awesome.css">
  <!-- Custom styles for this template -->
  <script src="http://maps.google.com/maps/api/js?sensor=true"></script>
  <script src="js/jquery.min.js"></script>
  <script src="/js/ie-emulation-modes-warning.js"></script>
  <script src="/js/ie10-viewport-bug-workaround.js" ></script>
  <script src="/strophe.js"></script>
  <script src="/plugins/strophe.rsm.js"></script>
  <script src="/plugins/strophe.archive.js"></script>
  <script src="/plugins/iso8601_support.js"></script>
  <script type="text/javascript" src="/js/gab.js"></script>
  <script type="text/javascript" src="/js/mainmap.js"></script>
</head>
<body onload="javascript: load('<?php if( isset($_REQUEST['q']) and !(empty($_REQUEST['q'])) ) echo substr($_REQUEST['q'], 1); ?>');">
	<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class="slot-opener navbar-brand" style="display:none;"><i class="fa fa-bars"></i></div>
        <a class="navbar-brand" href="#">J Project</a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li id="profile-name"><a href="#profile">Profile</a></li>
          <li class="active"><a href="/home.php">Home</a></li>
          <li class="dropdown" id="messages">
            <a class="dropdown-toggle" data-toggle="dropdown">Messages<span class="badge"></span></a>
            <ul id="message-list" class="dropdown-menu" role="menu">
            </ul>
          </li>
          <li><a href="#about">About</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Options<span class="caret"></span></a>
            <ul class="dropdown-menu" role="menu">
              <li><a href="#settings">Settings</a></li>
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
      <div id="request-show">
        <div class="box-text">
          Requests<span class="badge">0</span>
        </div>
      </div>
    </div>
    <div class="request-body">
      <div class="request-hide close"> X </div>
    </div>
  </div>
  <div class="sort-box">
    <div class="sort-opener">
      Filter Map Items
    </div>
    <div class="sort-options">
      <div class="sort-hide close"> X </div>
      <ul>
        <?php 
          $query = "SELECT * FROM `socialtags`";
          $result = mysqli_query($connection, $query)
          or die("<div class='page-header'><h3> Something went worng. Please reload the page. </h3></div>");
          while($row = mysqli_fetch_array($result)){
            echo '<li class="checkbox">
              <label class="col-xs-11 checklabel">'.$row['tagName'].'</label>
              <input type="checkbox" class="col-xs-1" onclick="javascript:checkAll();" '; 
                if( isset($_REQUEST['q']) and !(empty($_REQUEST['q'])) and strpos($_REQUEST["q"], $row["tagName"]) > 0)
                  echo "checked= 'checked'";
            echo ' name="'.$row['tagName'].'">
            </li>';
          }
        ?>
      </ul>
    </div>
  </div>
  <div id="chat-box">
    <ul></ul>
  </div>
  <div class="container main-box">
  	<div class="left-slot slot">
  		<div class="left-item item l-map">
        <div class="loader">
          <div class="spinner-container">
            <i class="fa fa-spin fa-spinner fa-3x fa-fw margin-bottom"></i>
          </div>
        </div>
        <div id="map"></div>
      </div>
  	</div>
  	<div class="right-slot slot">
  		<div class="right-item item r-contact">
        <div class="contact-box">
          <div id="contact-show">
            <div class="contact-pad">
              <input type="search" id="search_contact" placeholder="Search"/>
            </div>
          </div>
          <div class=" contact-pad contact-body">
            <div class="btn-group btn-group-justified">
              <div class="btn btn-group btn-special active" data-target=".map-contact"><span class="fa fa-globe"></span></div>
              <div class="btn btn-group btn-special" data-target=".friend-contact"><span class="fa fa-users"></span></div>
              <div class="btn btn-group btn-special" data-target=".event-contact"><span class="fa fa-feed"></span></div>
            </div>
            <ul class="map-contact list">
              <li>
                <div class="back-placeholder">Nobody is online nearby your current location</div>
              </li>
              <li class="main-data">
                <ul></ul>
              </li>
              <li class="search-data">
                <ul></ul>
              </li>
            </ul>
            <ul class="friend-contact list">
              <li>
                <div class="back-placeholder">Don't have any friends. Ask friends to join this platform.</div>
              </li>
              <li class="main-data">
                <ul></ul>
              </li>
              <li class="search-data">
                <ul></ul>
              </li>
            </ul>
            <ul class="event-contact list">
              <li>
                <div class="back-placeholder">There are no events or classifieds in your vicinity.</div>
              </li>
              <li class="main-data">
                <ul></ul>
              </li>
              <li class="search-data">
                <ul></ul>
              </li>
            </ul>
          </div>
        </div>
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