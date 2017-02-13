<?php
  session_start();
  require('/php/connectdb.php');

  $connection=mysqli_connect ('localhost', $username, $password);
  if (!$connection) {
    die('Not connected : ' . mysql_error());
  }

  $db_selected = mysqli_select_db($connection, $database) or die ('Can\'t use db : ' . mysql_error());
  $level = 0;
  if(isset($_SESSION['userid'])){
    $result = mysqli_query($connection, 'SELECT signupLevel FROM `markers` WHERE id="'.$_SESSION['userid'].'" ')or die('Can\'t process right now ');
    $res = mysqli_fetch_array($result);
    $level = $res['signupLevel'];
    if($level == 5)
      header("Location: /home.php");
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
  <?php if($level == 0){ ?>
  <title> J Project | Welcome to awesomeness </title>
  <?php }elseif($level == 1){ ?>
  <title> J Project | Tell us more </title>
  <?php }elseif($level == 2){ ?>
  <title> J Project | Tell us how you look </title>
  <?php }elseif($level == 3){ ?>
  <title> J Project | Almost there </title>
  <?php }elseif($level == 4){ ?>
  <title> J Project | Ready to enter a whole new world </title>
  <?php } ?>

  <!-- Bootstrap core CSS -->
  <link href="/css/bootstrap.min.css" rel="stylesheet">
  <link href="/css/bootstrap-theme.min.css" rel="stylesheet">
  <script src="js/jquery.min.js"></script>
  <script src="/js/ie-emulation-modes-warning.js"></script>
  <script src="/js/ie10-viewport-bug-workaround.js" ></script>
  <script src="/js/validate.js"></script>
  <script src="/js/signuphelper.js"></script>
  <script src="/strophe.min.js"></script>
  <script src="/plugins/strophe.register.js"></script>
  <script src="js/jquery.min.js"></script>
  <link rel="stylesheet" type="text/css" href="/css/jproject.css">
  <link rel="stylesheet" type="text/css" href="/css/signup.css">
</head>
<body>
  <?php if($level == 0){ ?>
  <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="/">
          <img src="/favicon.png" alt="Jproject" height="40px" >
        </a>
      </div>
    </div>
  </div>
  <?php }else{ ?>
  <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="/">
          <img src="/favicon.png" alt="Jproject" height="40px" >
        </a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><a id="logout"><?php echo explode(" ", $_SESSION['name'])[0];?> (log out)</a></li>
        </ul>
      </div>
    </div>
  </div>
  <?php } ?>
  <?php if($level == 0){ ?>
  <div class="container main">
    <form action="javascript: validate();" class="form-signin">
      <div class="page-header">
        <h3>Be a part of J project</h3>
      </div>
      <div class="form-group has-feedback">
        <input type="text" class="form-control" id="name" placeholder="Your Name" />
      </div>
      <div class="form-group has-feedback">
        <input type="email" class="form-control" id="email" placeholder="Your E mail Address" />
      </div>
      <div class="form-group has-feedback">
          <input type="mobile" maxlength="10" class="form-control" id="number" placeholder="Mobile Number" data-toggle="tooltip" data-placement="bottom" title="Mobile number will be used for verification and as your login credential" />
      </div>
      <div class="form-group has-feedback">
        <input type="password" class="form-control" id="pass" placeholder="Password" data-toggle="tooltip" data-placement="bottom" title="Choose a strong password for your account minimum 6 characters"/>
      </div>
      <div class="form-group has-feedback">
        <input type="password" class="form-control" id="pass1" placeholder="Confirm Password" data-toggle="tooltip" data-placement="bottom" title="Re enter the password to make sure you entered right password"/>
      </div>
      <div class="divider"></div>

      <div class="dropdown-header">
        Choose a Username<span style="color:#777;">  ( like user101 )</span>
      </div>
      <div class="form-group has-feedback">
        <input type="text" class="form-control" id="username" placeholder="Username" data-toggle="tooltip" data-placement="bottom" title="Choose a username that defines you. People will be able to see this in place of your name (available symbols are . _ -)" />
      </div>
      <img src="/php/captcha.php?rand=<?php echo rand();?>" id='captchaimg' style="max-width:150px">
      <div class="dropdown-header">
        Enter the above code
      </div>
      <div class="form-group">
        <input type="text" id="captcha_code" name="captcha_code" maxlength="6" class="form-control" placeholder="Enter Captcha" data-toggle="tooltip" data-placement="bottom" title="This is to make sure that you are Human"/>
      </div>
      Can't read the image? click <a href='javascript: Motion.refreshCaptcha();'>here</a> to refresh.
      <br>
      <br>
      <div class="form-group">
        <button class="btn btn-lg btn-danger btn-block" type="submit">Create Account</button>
      </div>
    </form>
  </div>
  <?php }elseif($level == 1){ ?>
  <div class="container main">
    <form action="javascript: validateMobile();" class="form-signin">
      <div class="page-header">
        <h3>Let us know a little more about you</h3>
      </div>
      <div class="form-group has-feedback">
        <input type="text" class="form-control" id="city" placeholder="Current City" data-toggle="tooltip" data-placement="bottom" title="This will help you find people who belong to same city when you are out of town." />
      </div>
      <div class="form-group has-feedback">
        <select type="text" class="form-control" id="gender" placeholder="Select your Gender" >
          <option value="0" selected="selected" disabled="disabled">Select your Gender</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
      </div>
      <button class="btn btn-lg btn-danger btn-block" type="submit">Continue</button>
    </form>
  </div>
  <?php }elseif($level == 2){ ?>
  <div class="container main">
    <div class="page-header">
      <h3>Upload your Profile Picture</h3>
    </div>
    <div class="col-sm-4">
      <div class="image-handler">
        <div class="inner-image-box">
          <img src="" class="img-thumbnail" alt="" />
        </div>
      </div>
      <form id="imageUploadForm" enctype="multipart/form-data">
        <div class="form-group">
          <input class="form-control" type="file" name="image" id="imagefile">
        </div>
        <button class="hidden" type="submit" id="imageAjaxSubmit"></button>
      </form>
      <form enctype="multipart/form-data" method="POST" action="/php/imageupload.php">
        <input type="text" class="hidden" name="ImageFileName" id="ImageFileName">
        <input type="text" class="hidden" name="t" value="3">
        <input type="text" class="hidden" name="refresh" value="1">
        <button type="submit" id="forward" class="btn btn-lg btn-danger btn-block" disabled="true"> Continue </button>
        <label style="float:right;"><a href="javascript: insert(1);">Skip this step</a></label>
      </form>
    </div>
    <div class="col-sm-4">
      <div class="image-handler" style="visibility:hidden;"></div>
    </div>
  </div>
  <?php }elseif($level == 3){ ?>
  <div class="container main">
    <div class="page-header">
      <h2>Select categories that intrest you</h2>
    </div>
    <form action="javascript: compile();" id="intrest-form">
      <?php
        $query = "SELECT * FROM `socialtags`";
        $result = mysqli_query($connection, $query)
        or die("<div class='page-header'><h3> Something went worng. Please reload the page. </h3></div>");
        while($row = mysqli_fetch_array($result)){
          echo '<div class="checkbox form-group col-xs-12">
            <label class="col-xs-9 checklabel">'.$row['tagName'].'</label>
            <input type="checkbox" class="col-xs-1" name="'.$row['tagName'].'">
          </div>';
        }
      ?>
      <div class="col-xs-12 form-group">
        <div class="col-xs-10">
          <button class="btn btn-lg btn-danger center-block" type="submit"> Let's Get Started </button>
        </div>
      </div>
    </form>
  </div>
  <?php }elseif($level == 4){ ?>
  <div class="container main">
    <div class="page-header">
      <h2>Update your status</h2>
    </div>
    <form name="status-form" action="javascript: insert(3);">
      <div class="form-group has-feedback">
        <textarea class="form-control" id="status" name="status" rows="3" maxlength="120" placeholder="Enter Your status"></textarea>
      </div>
      <label style="float:right;"><a href="javascript: insert(2);">Skip this step</a></label>
      <input type="submit" class="btn btn-lg btn-danger" value="Initiate the process" />
    </form>
  </div>
  <?php } ?>
  <footer>
    <div class="subfooter">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <p class="text-center">Copyright © 2015 JProject.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <script type="text/javascript">
  $(document).ready(function(){
    if($(document).height() == $(window).height()){
      $('footer').css('bottom', '0px').css('position', 'absolute').css('width', '100%');
    }
  });
  $(window).resize(function(){
    if($(document).height() == $(window).height()){
      $('footer').css('bottom', '0px').css('position', 'absolute').css('width', '100%');
    }else{
      $('footer').css('bottom', 'auto').css('position', 'relative').css('width', '100%');
    }
  });
  </script>
  <script src="/js/bootstrap.min.js"></script>
  <script src="/js/docs.min.js"></script>
</body>
</html>